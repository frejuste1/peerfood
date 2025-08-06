<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const props = defineProps({
  cartItems: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['submit-order', 'close']);

const removeItem = (itemId) => {
  cartStore.decreaseItemQuantity(itemId);
  // If cart becomes empty after removing item, close the modal
  if (cartStore.itemCount === 0) {
    emit('close');
  }
};

const cancelOrder = () => {
  cartStore.clearCart();
  emit('close');
};

const submitOrder = () => {
  emit('submit-order', {
    items: props.cartItems,
    total: props.total
  });
};
</script>

<template>
  <div class="order-form-overlay">
    <div class="order-form">
      <h2>Paiement Wave</h2>
      
      <div class="order-summary">
        <h3>Résumé de votre commande</h3>
        <div class="order-items">
          <div v-if="cartItems.length === 0" class="empty-cart-message">
            Votre panier est vide.
          </div>
          <div v-for="item in cartItems" :key="item.id" class="order-item">
            <div class="item-details">
              <span>{{ item.designation }} x {{ item.quantity }}</span>
              <span>{{ cartStore.formatPrice(item.price * item.quantity) }}</span>
            </div>
            <button @click="removeItem(item.id)" class="remove-item-button">Retirer</button>
          </div>
        </div>
        <div class="order-total">
          <strong>Total:</strong>
          <span>{{ total.toFixed(2) }} XOF</span>
        </div>
      </div>

      <form @submit.prevent="submitOrder" class="delivery-form">
        <div class="form-actions">
          <button type="button" class="cancel-button" @click="cancelOrder">Annuler la commande</button>
          <button type="submit" class="submit-button" :disabled="cartItems.length === 0">Payer avec Wave</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.order-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.order-form {
  background-color: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.order-summary {
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: var(--gray-100);
  border-radius: var(--border-radius);
}

.order-items {
  margin: 1rem 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
  color: var(--gray-500);
}

.item-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.remove-item-button {
  background-color: var(--danger-light);
  color: var(--danger);
  border: 1px solid var(--danger);
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.8em;
  margin-left: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.remove-item-button:hover {
  background-color: var(--danger);
  color: var(--white);
}

.empty-cart-message {
  text-align: center;
  padding: 1rem;
  color: var(--gray-500);
}

.order-total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: var(--border-width) var(--border-style) var(--border-color);
  font-size: 1.1em;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--gray-500);
}

.item-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.remove-item-button {
  background-color: var(--danger-light);
  color: var(--danger);
  border: 1px solid var(--danger);
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.8em;
  margin-left: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.remove-item-button:hover {
  background-color: var(--danger);
  color: var(--white);
}

.empty-cart-message {
  text-align: center;
  padding: 1rem;
  color: var(--gray-500);
}

input {
  width: 100%;
  padding: 0.75rem;
  border: var(--border-width) var(--border-style) var(--border-color);
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1.1em;
}

.help-text {
  display: block;
  margin-top: 0.5rem;
  color: var(--gray-500);
  font-size: 0.9em;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: background-color var(--transition-duration) var(--transition-timing);
}

.cancel-button {
  background-color: var(--gray-200);
  color: var(--gray-500);
}

.item-details {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.remove-item-button {
  background-color: var(--danger-light);
  color: var(--danger);
  border: 1px solid var(--danger);
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.8em;
  margin-left: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.remove-item-button:hover {
  background-color: var(--danger);
  color: var(--white);
}

.empty-cart-message {
  text-align: center;
  padding: 1rem;
  color: var(--gray-500);
}

.cancel-button:hover {
  background-color: var(--gray-300);
}

.submit-button {
  background-color: var(--success);
  color: var(--white);
}

.submit-button:hover {
  background-color: var(--green-400);
}

.submit-button:disabled {
  background-color: var(--gray-300);
  cursor: not-allowed;
}
</style>