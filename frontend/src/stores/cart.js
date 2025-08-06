import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
};

export const useCartStore = defineStore('cart', () => {
  const items = ref(loadCartFromLocalStorage());
  const showCart = ref(false);

  // Watch for changes in items and save to localStorage
  watch(items, (newItems) => {
    localStorage.setItem('cartItems', JSON.stringify(newItems));
  }, { deep: true });

  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0);
  });

  function addItem(meal) {
    const existingItem = items.value.find(item => item.id === meal.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({
        ...meal,
        quantity: 1
      });
    }
  }

  function removeItem(itemId) {
    items.value = items.value.filter(item => item.id !== itemId);
  }

  function decreaseItemQuantity(itemId) {
    const item = items.value.find(i => i.id === itemId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        removeItem(itemId);
      }
    }
  }

  function clearCart() {
    items.value = [];
  }

  function toggleCart() {
    showCart.value = !showCart.value;
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  }

  return {
    items,
    showCart,
    total,
    itemCount,
    addItem,
    removeItem,
    decreaseItemQuantity,
    clearCart,
    toggleCart,
    formatPrice
  };
});