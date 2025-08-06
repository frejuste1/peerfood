<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import authService from '@/services/auth';

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  username: '',
  password: ''
});

const error = ref('');
const isLoading = ref(false);

// Validation des champs
const usernameError = computed(() => {
  if (!formData.value.username) return '';
  // Vous pouvez ajouter des règles de validation spécifiques pour le nom d'utilisateur ici si nécessaire
  return formData.value.username.length < 3 ? 'Le nom d\'utilisateur doit contenir au moins 3 caractères' : '';
});

const passwordError = computed(() => {
  if (!formData.value.password) return '';
  return formData.value.password.length < 6 ? 'Le mot de passe doit contenir au moins 6 caractères' : '';
});

const isFormValid = computed(() => {
  return formData.value.username && 
         formData.value.password && 
         !usernameError.value && 
         !passwordError.value;
});

const handleSubmit = async () => {
  if (!isFormValid.value) {
    error.value = 'Veuillez corriger les erreurs du formulaire';
    return;
  }

  try {
    isLoading.value = true;
    error.value = '';
    
    // Appel au service d'authentification (qui gère maintenant les cookies)
    await authService.login(formData.value.username, formData.value.password);
    
    // Initialisation de l'authentification pour récupérer les données utilisateur
    await authStore.initializeAuth();
    
    // Redirection vers la page demandée ou la page d'accueil
    const redirectPath = router.currentRoute.value.query.redirect || '/';
    router.push(redirectPath);
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <main id="login-container">
    <h1>Login</h1>
    <form id="login-form" @submit.prevent="handleSubmit">
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="form-group">
        <input 
          type="text" 
          id="username" 
          v-model="formData.username" 
          placeholder=" " 
          required
          :class="{ 'error': usernameError }"
        >
        <label for="username" class="floating-label">Nom d'utilisateur</label>
        <span v-if="usernameError" class="error-text">{{ usernameError }}</span>
      </div>
      <div class="form-group">
        <input 
          type="password" 
          id="password" 
          v-model="formData.password" 
          placeholder=" " 
          required
          :class="{ 'error': passwordError }"
        >
        <label for="password" class="floating-label">Mot de passe</label>
        <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
      </div>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Connexion en cours...' : 'Se connecter' }}
      </button>
      <div class="forgot-password">
        <router-link to="/reset-password">Mot de passe oublié ?</router-link>
      </div>
    </form>
  </main>
</template>

<style scoped>
#login-container {
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

#login-container:hover {
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

#login-form {
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

.forgot-password {
  text-align: center;
  margin-top: 1rem;
}

.forgot-password a {
  color: var(--orange-400);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password a:hover {
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

.register-link {
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 0.95rem;
}

.register-link a {
  color: var(--orange-300);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 0.2rem 0;
  border-bottom: 1px solid transparent;
}

.register-link a:hover {
  color: var(--orange-400);
  border-bottom-color: var(--orange-400);
}
</style>