<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import OrderService from '@/services/order';

const authStore = useAuthStore();
const router = useRouter();

const orders = ref([]);
const isLoading = ref(false);
const error = ref(null);
const cancellingOrder = ref(null);

const loadOrders = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    orders.value = await OrderService.getUserOrders();
  } catch (err) {
    error.value = 'Erreur lors du chargement de l\'historique des commandes';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const cancelOrder = async (orderId) => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
    return;
  }

  try {
    cancellingOrder.value = orderId;
    await OrderService.cancelOrder(orderId);
    // Recharger les commandes pour refléter le changement
    await loadOrders();
  } catch (err) {
    error.value = 'Erreur lors de l\'annulation de la commande';
    console.error(err);
  } finally {
    cancellingOrder.value = null;
  }
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  await loadOrders();
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusClass = (status) => {
  const statusClasses = {
    pending: 'status-pending',
    processing: 'status-processing',
    completed: 'status-completed',
    cancelled: 'status-cancelled'
  };
  return statusClasses[status] || 'status-default';
};

const getStatusText = (status) => {
  const statusTexts = {
    pending: 'En attente',
    processing: 'En cours',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };
  return statusTexts[status] || status;
};
</script>

<template>
  <div class="order-history">
    <h1>Historique des Commandes</h1>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="isLoading" class="loading">
      Chargement de votre historique...
    </div>

    <div v-else-if="orders.length === 0" class="no-orders">
      <p>Vous n'avez pas encore passé de commande.</p>
      <button @click="router.push('/')" class="browse-button">
        Parcourir le menu
      </button>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>Commande #{{ order.id }}</h3>
          <span :class="['status-badge', getStatusClass(order.status)]">
            {{ getStatusText(order.status) }}
          </span>
        </div>

        <div class="order-info">
          <p class="order-date">Commandé le {{ formatDate(order.createdAt) }}</p>
          <p class="order-total">Total: {{ order.total }} XOF</p>
        </div>

        <div class="order-items">
          <h4>Articles commandés:</h4>
          <ul>
            <li v-for="item in order.items" :key="item.id" class="order-item">
              <div class="item-image">
                <img :src="item.meal.image" :alt="item.meal.designation">
              </div>
              <div class="item-details">
                <h5>{{ item.meal.designation }}</h5>
                <p>Quantité: {{ item.quantity }}</p>
                <p>Prix unitaire: {{ item.price }} XOF</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="order-actions">
          <button 
            v-if="order.status === 'completed'"
            @click="router.push(`/order/${order.id}/review`)"
            class="review-button"
          >
            Laisser un avis
          </button>
          <button 
            v-if="order.status === 'pending'"
            @click="cancelOrder(order.id)"
            class="cancel-button"
            :disabled="cancellingOrder === order.id"
          >
            <span v-if="cancellingOrder === order.id" class="spinner"></span>
            {{ cancellingOrder === order.id ? 'Annulation...' : 'Annuler la commande' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-history {
  padding: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.error-message {
  background-color: var(--danger-light);
  color: var(--danger);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
}

.loading {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--gray-400);
}

.no-orders {
  text-align: center;
  padding: var(--spacing-xl);
}

.browse-button {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-duration) var(--transition-timing);
}

.browse-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.order-card {
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  transition: all var(--transition-duration) var(--transition-timing);
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending {
  background-color: var(--warning-light);
  color: var(--warning);
}

.status-processing {
  background-color: var(--info-light);
  color: var(--info);
}

.status-completed {
  background-color: var(--success-light);
  color: var(--success);
}

.status-cancelled {
  background-color: var(--danger-light);
  color: var(--danger);
}

.order-info {
  color: var(--gray-400);
  font-size: 0.9rem;
  margin-bottom: var(--spacing-md);
}

.order-items {
  margin-top: var(--spacing-md);
}

.order-items h4 {
  margin-bottom: var(--spacing-md);
  color: var(--gray-500);
}

.order-items ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-bottom: var(--border-width) var(--border-style) var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h5 {
  margin: 0 0 var(--spacing-xs);
  color: var(--gray-500);
}

.item-details p {
  margin: var(--spacing-xs) 0;
  color: var(--gray-400);
  font-size: 0.9rem;
}

.order-actions {
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}

.review-button,
.cancel-button {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all var(--transition-duration) var(--transition-timing);
}

.review-button {
  background-color: var(--primary);
  color: var(--white);
}

.cancel-button {
  background-color: var(--danger);
  color: var(--white);
}

.review-button:hover,
.cancel-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .order-history {
    padding: var(--spacing-md);
  }

  .order-item {
    flex-direction: column;
  }

  .item-image {
    width: 100%;
    height: 160px;
  }

  .order-actions {
    flex-direction: column;
  }

  .review-button,
  .cancel-button {
    width: 100%;
  }
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.cancel-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>