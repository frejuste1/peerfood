<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const retryPayment = () => {
  router.go(-1); // Retourne à la page précédente pour réessayer
};

const goToHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="payment-error">
    <div class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12" y2="16" />
        </svg>
      </div>
      <h1>Échec du Paiement</h1>
      <p>Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer ou contacter notre support si le problème persiste.</p>
      <div class="button-group">
        <button class="retry-btn" @click="retryPayment">
          Réessayer le paiement
        </button>
        <button class="home-btn" @click="goToHome">
          Retour à l'accueil
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.payment-error {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
}

.error-container {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.error-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #dc3545;
}

.error-icon svg {
  width: 100%;
  height: 100%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 16px;
  font-size: 2em;
}

p {
  color: #666;
  margin-bottom: 24px;
  font-size: 1.1em;
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.retry-btn, .home-btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
}

.retry-btn {
  background-color: #007bff;
  color: white;
}

.retry-btn:hover {
  background-color: #0056b3;
}

.home-btn {
  background-color: #6c757d;
  color: white;
}

.home-btn:hover {
  background-color: #5a6268;
}
</style>