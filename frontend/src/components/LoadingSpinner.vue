<template>
  <div :class="['loading-spinner', { 'full-screen': fullScreen }]">
    <div class="spinner-container">
      <div :class="['spinner', size]">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    message: {
      type: String,
      default: ''
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  position: relative;
  display: inline-block;
}

.spinner.small {
  width: 30px;
  height: 30px;
}

.spinner.medium {
  width: 50px;
  height: 50px;
}

.spinner.large {
  width: 70px;
  height: 70px;
}

.spinner-ring {
  position: absolute;
  border: 3px solid transparent;
  border-top: 3px solid var(--orange-300);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner.small .spinner-ring {
  width: 30px;
  height: 30px;
}

.spinner.medium .spinner-ring {
  width: 50px;
  height: 50px;
}

.spinner.large .spinner-ring {
  width: 70px;
  height: 70px;
}

.spinner-ring:nth-child(1) {
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.4s;
  border-top-color: var(--orange-400);
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.8s;
  border-top-color: var(--orange-500);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-message {
  color: var(--gray-500);
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

/* Animation d'apparition */
.loading-spinner {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>