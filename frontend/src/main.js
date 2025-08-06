import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth';

const app = createApp(App)

const pinia = createPinia();
app.use(pinia);

// Initialize authentication state before mounting the app
const authStore = useAuthStore();
authStore.initializeAuth().then(() => {
  app.use(router);
  app.mount('#app');
}).catch(error => {
  console.error("Failed to initialize auth or router:", error);
  // Fallback or error handling if needed, for now, we still mount the app
  // but router might not be ready or auth state might be incorrect.
  app.use(router); // Attempt to use router anyway or provide a fallback UI
  app.mount('#app');
});
