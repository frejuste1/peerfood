<script setup>
import { RouterView } from 'vue-router'
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import { useRoute } from 'vue-router'
import { useCartStore } from './stores/cart'

const route = useRoute()
const cartStore = useCartStore()
const searchQuery = ref('')

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleToggleCart = () => {
  cartStore.toggleCart()
}
</script>

<template>
  <div class="app-container">
    <NavBar
      :cart-item-count="cartStore.itemCount"
      @search="handleSearch"
      @toggle-cart="handleToggleCart"
    />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Reset CSS de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9fafb;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-top: 72px; /* Hauteur de la barre de navigation + marge */
  padding: 2rem;
  flex: 1;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
