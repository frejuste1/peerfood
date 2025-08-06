<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import NavBar from './components/NavBar.vue'
import NotificationContainer from './components/NotificationContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import { useRoute } from 'vue-router'
import { useCartStore } from './stores/cart'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()
const searchQuery = ref('')

onMounted(async () => {
  // Initialiser l'authentification au démarrage de l'application
  try {
    await authStore.initializeAuth()
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'authentification:', error)
  }
})

const handleSearch = (query) => {
  searchQuery.value = query
}

const handleToggleCart = () => {
  cartStore.toggleCart()
}
</script>

<template>
  <div class="app-container">
    <ErrorBoundary>
      <NavBar
        :cart-item-count="cartStore.itemCount"
        @search="handleSearch"
        @toggle-cart="handleToggleCart"
      />
      <main class="main-content">
        <RouterView />
      </main>
      
      <!-- Container pour les notifications globales -->
      <NotificationContainer />
    </ErrorBoundary>
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
  min-height: calc(100vh - 72px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    margin-top: 60px; /* Hauteur réduite sur mobile */
  }
}

/* Styles globaux pour les composants */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
