<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12" y2="16" />
        </svg>
      </div>
      
      <h2>Oups ! Une erreur est survenue</h2>
      
      <div v-if="showDetails" class="error-details">
        <p><strong>Erreur:</strong> {{ error?.message || 'Erreur inconnue' }}</p>
        <details v-if="error?.stack && isDevelopment">
          <summary>Détails techniques</summary>
          <pre>{{ error.stack }}</pre>
        </details>
      </div>
      
      <div class="error-actions">
        <button @click="retry" class="btn btn-primary">
          Réessayer
        </button>
        <button @click="goHome" class="btn btn-secondary">
          Retour à l'accueil
        </button>
        <button 
          v-if="!showDetails" 
          @click="showDetails = true" 
          class="btn btn-link"
        >
          Voir les détails
        </button>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ErrorBoundary',
  setup() {
    const router = useRouter()
    const hasError = ref(false)
    const error = ref(null)
    const showDetails = ref(false)
    const isDevelopment = import.meta.env.DEV
    
    onErrorCaptured((err, instance, info) => {
      console.error('Error captured by ErrorBoundary:', err)
      console.error('Component instance:', instance)
      console.error('Error info:', info)
      
      hasError.value = true
      error.value = err
      
      // Empêcher la propagation de l'erreur
      return false
    })
    
    const retry = () => {
      hasError.value = false
      error.value = null
      showDetails.value = false
      
      // Recharger la page ou réinitialiser l'état
      window.location.reload()
    }
    
    const goHome = () => {
      hasError.value = false
      error.value = null
      showDetails.value = false
      router.push('/')
    }
    
    return {
      hasError,
      error,
      showDetails,
      isDevelopment,
      retry,
      goHome
    }
  }
}
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
}

.error-container {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  color: #dc3545;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.error-details {
  text-align: left;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid #dc3545;
}

.error-details p {
  margin: 0 0 1rem 0;
  color: #666;
}

details {
  margin-top: 1rem;
}

summary {
  cursor: pointer;
  font-weight: 600;
  color: #007bff;
  margin-bottom: 0.5rem;
}

pre {
  background: #f1f3f4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.875rem;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #545b62;
  transform: translateY(-1px);
}

.btn-link {
  background: none;
  color: #007bff;
  text-decoration: underline;
}

.btn-link:hover {
  color: #0056b3;
}

@media (max-width: 768px) {
  .error-container {
    padding: 2rem 1.5rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>