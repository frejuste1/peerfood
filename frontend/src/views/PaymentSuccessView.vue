<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToOrderHistory = () => {
  router.push('/order-history');
};
</script>

<template>
  <div class="payment-success">
    <div class="success-container">
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h1>Paiement Réussi !</h1>
      <p>Votre commande a été confirmée et sera préparée sous peu.</p>
      <button class="view-order-btn" @click="goToOrderHistory">
        Voir mes commandes
      </button>
    </div>
  </div>
</template>

<style scoped>
.payment-success {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
}

.success-container {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #4CAF50;
}

.success-icon svg {
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

.view-order-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-order-btn:hover {
  background-color: #45a049;
}
</style>