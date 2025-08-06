<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();
const searchQuery = ref('');

const props = defineProps({});

const isAuthenticated = computed(() => authStore.isAuthenticated);
const cartItemCount = computed(() => cartStore.itemCount);
const showNavbar = computed(() => !["/login", "/register"].includes(route.path));

const emit = defineEmits(['search', 'toggle-cart']);

const handleSearch = () => {
  emit('search', searchQuery.value);
};
</script>

<template>
  <nav v-if="showNavbar" class="navbar">
    <div class="navbar-brand">
      <img src="../assets/logo.png" alt="Logo Cantine" class="navbar-logo" />
    </div>
    
    <div class="navbar-search">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Rechercher un plat..."
        class="search-input"
        @input="handleSearch"
      />
    </div>
    
    <div class="navbar-actions">
      <button 
        class="cart-button"
        @click="cartStore.toggleCart()"
      >
        <span class="cart-icon">🛒</span>
        <span v-if="cartItemCount" class="cart-count">{{ cartItemCount }}</span>
      </button>
      
      <button 
        v-if="!isAuthenticated" 
        class="auth-button login"
        @click="$router.push('/login')"
      >
        Se connecter
      </button>
      

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-brand {
  flex: 0 0 auto;
}

.navbar-logo {
  height: 40px;
  width: auto;
}

.navbar-search {
  flex: 0 1 500px;
  margin: 0 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--orange-300);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cart-button {
  position: relative;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--red-300);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 20px;
}

.auth-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-button.login {
  background-color: transparent;
  border: 1px solid var(--orange-300);
  color: var(--orange-300);
}

.auth-button.login:hover {
  background-color: var(--orange-300);
  color: white;
}

.auth-button.register {
  background-color: var(--orange-300);
  border: 1px solid var(--orange-300);
  color: white;
}

.auth-button.register:hover {
  background-color: var(--orange-300);
  border-color: var(--orange-300);
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  
  .navbar-search {
    margin: 0 1rem;
  }
  
  .auth-button {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .navbar-search {
    display: none;
  }
}
</style>