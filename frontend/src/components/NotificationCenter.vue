<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import NotificationService from '@/services/notification';

const props = defineProps({
  maxNotifications: {
    type: Number,
    default: 5
  }
});

const authStore = useAuthStore();
const notifications = ref([]);
const isLoading = ref(false);
const error = ref(null);
const showNotifications = ref(false);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

const loadNotifications = async () => {
  if (!authStore.isAuthenticated) return;
  
  try {
    isLoading.value = true;
    const response = await NotificationService.getNotifications();
    notifications.value = response.slice(0, props.maxNotifications);
  } catch (err) {
    error.value = 'Erreur lors du chargement des notifications';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const markAsRead = async (notification) => {
  try {
    await NotificationService.markAsRead(notification.id);
    notification.read = true;
  } catch (err) {
    console.error('Erreur lors du marquage de la notification comme lue:', err);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
};

watch(() => authStore.isAuthenticated, (newValue) => {
  if (newValue) {
    loadNotifications();
  } else {
    notifications.value = [];
  }
});

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadNotifications();
  }
});
</script>

<template>
  <div class="notification-center">
    <div 
      class="notification-icon" 
      @click="showNotifications = !showNotifications"
    >
      🔔
      <span 
        v-if="unreadCount > 0" 
        class="notification-badge"
      >
        {{ unreadCount }}
      </span>
    </div>

    <div 
      v-if="showNotifications" 
      class="notification-panel"
    >
      <div class="notification-header">
        <h3>Notifications</h3>
        <button 
          class="close-button"
          @click="showNotifications = false"
        >
          ×
        </button>
      </div>

      <div v-if="isLoading" class="notification-loading">
        Chargement...
      </div>

      <div v-else-if="error" class="notification-error">
        {{ error }}
      </div>

      <div v-else-if="notifications.length === 0" class="no-notifications">
        Aucune notification
      </div>

      <div v-else class="notification-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          :class="['notification-item', { unread: !notification.read }]"
          @click="markAsRead(notification)"
        >
          <div class="notification-content">
            <p class="notification-message">{{ notification.message }}</p>
            <span class="notification-date">{{ formatDate(notification.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-center {
  position: relative;
}

.notification-icon {
  cursor: pointer;
  font-size: 1.5rem;
  position: relative;
  padding: var(--spacing-sm);
  transition: transform var(--transition-duration) var(--transition-timing);
}

.notification-icon:hover {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--danger);
  color: var(--white);
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
  min-width: 18px;
  text-align: center;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: var(--border-width) var(--border-style) var(--border-color);
}

.notification-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--gray-500);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-400);
  padding: 0;
  line-height: 1;
}

.notification-loading,
.notification-error,
.no-notifications {
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--gray-400);
}

.notification-error {
  color: var(--danger);
}

.notification-list {
  padding: var(--spacing-sm);
}

.notification-item {
  padding: var(--spacing-md);
  border-bottom: var(--border-width) var(--border-style) var(--border-color);
  cursor: pointer;
  transition: background-color var(--transition-duration) var(--transition-timing);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background-color: var(--primary-light);
}

.notification-item:hover {
  background-color: var(--gray-100);
}

.notification-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.notification-message {
  margin: 0;
  color: var(--gray-500);
  font-size: 0.9rem;
  line-height: 1.4;
}

.notification-date {
  font-size: 0.8rem;
  color: var(--gray-400);
}

@media (max-width: 768px) {
  .notification-panel {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 60vh;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }
}
</style>