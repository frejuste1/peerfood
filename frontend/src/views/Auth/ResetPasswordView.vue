<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth';

const router = useRouter();

const formData = ref({
  email: ''
});

const error = ref('');
const success = ref('');
const isLoading = ref(false);

// Validation des champs
const emailError = computed(() => {
  if (!formData.value.email) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailRegex.test(formData.value.email) ? 'Veuillez entrer une adresse email valide' : '';
});

const isFormValid = computed(() => {
  return formData.value.email && !emailError.value;
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = 'Veuillez corriger les erreurs du formulaire';
    return;
  }

  try {
    isLoading.value = true;
    error.value = '';
    success.value = '';
    
    // Simulation d'un appel API pour réinitialiser le mot de passe
    // À remplacer par un véritable appel à votre service d'authentification
    // await authService.resetPassword(formData.value.email);
    
    // Simulons une réponse positive
    setTimeout(() => {
      success.value = 'Un email de réinitialisation a été envoyé à votre adresse email.';
      isLoading.value = false;
    }, 1500);
    
  } catch (err) {
    error.value = err.message;
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <main id="reset-password-container">
    <h1>Réinitialisation du mot de passe</h1>
    <form id="reset-password-form" @submit.prevent="handleSubmit">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="success" class="success-message">
        {{ success }}
      </div>
      <div class="form-group">
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          placeholder=" " 
          required
          :class="{ 'error': emailError }"
        >
        <label for="email" class="floating-label">Adresse email</label>
        <span v-if="emailError" class="error-text">{{ emailError }}</span>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe' }}
      </button>
      <div class="login-link">
        <a href="#" @click.prevent="goToLogin">Retour à la connexion</a>
      </div>
    </form>
  </main>
</template>

<style scoped>
#reset-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem;
  max-width: 420px;
  margin: 3rem auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(0);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

#reset-password-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
}

h1 {
  color: var(--orange-400);
  margin-bottom: 2.5rem;
  font-size: 2.2rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: -0.5px;
}

#reset-password-form {
  width: 100%;
}

.form-group {
  position: relative;
  margin-bottom: 1.8rem;
  width: 100%;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
}

.success-message {
  background-color: #d1fae5;
  color: #047857;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  text-align: center;
  width: 100%;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

input.error {
  border-color: #dc2626;
}

input.error:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link a {
  color: var(--orange-400);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: var(--orange-500);
  text-decoration: underline;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

input {
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: transparent;
  transition: all 0.3s ease;
  color: #333;
}

input:hover {
  border-color: #d0d0d0;
}

input:focus {
  outline: none;
  border-color: var(--orange-300);
  box-shadow: 0 0 0 3px rgba(var(--orange-300-rgb), 0.1);
}

.floating-label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffff;
  padding: 0 0.5rem;
  color: #666;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  letter-spacing: 0.2px;
}

input:focus ~ .floating-label,
input:not(:placeholder-shown) ~ .floating-label {
  top: 0;
  font-size: 0.85rem;
  color: var(--orange-300);
  transform: translateY(-50%) scale(0.85);
  font-weight: 500;
}

button {
  width: 100%;
  padding: 0.9rem;
  background-color: var(--orange-300);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;
}

button:hover {
  background-color: var(--orange-400);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--orange-300-rgb), 0.2);
}

button:active {
  transform: translateY(0);
  box-shadow: none;
}
</style>