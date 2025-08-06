<template>
  <Teleport to="body">
    <div class="notification-container">
      <TransitionGroup name="notification" tag="div">
        <NotificationToast
          v-for="notification in notifications"
          :key="notification.id"
          :type="notification.type"
          :title="notification.title"
          :message="notification.message"
          :duration="notification.duration"
          :auto-close="notification.autoClose"
          @close="removeNotification(notification.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script>
import { computed } from 'vue'
import NotificationToast from './NotificationToast.vue'
import { globalNotifications } from '@/composables/useNotifications'

export default {
  name: 'NotificationContainer',
  components: {
    NotificationToast
  },
  setup() {
    const notifications = computed(() => globalNotifications.notifications.value)
    
    const removeNotification = (id) => {
      globalNotifications.removeNotification(id)
    }
    
    return {
      notifications,
      removeNotification
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  width: 100%;
}

/* Animations pour les transitions */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .notification-container {
    top: auto;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
  
  .notification-enter-from,
  .notification-leave-to {
    transform: translateY(100%);
  }
}
</style>