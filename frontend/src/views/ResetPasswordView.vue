<template>
  <div class="reset-password-view">
    <div class="reset-password-container">
      <!-- Étape 1: Demande de réinitialisation -->
      <div v-if="step === 'request'" class="reset-step">
        <div class="reset-header">
          <h1>Réinitialisation du mot de passe</h1>
          <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
        </div>
        
        <form @submit.prevent="handleRequestReset" class="reset-form">
          <div class="form-group">
            <label for="email">Adresse email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="loading"
              class="form-control"
              placeholder="votre@email.com"
            />
          </div>
          
          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="loading || !email.trim()"
          >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Envoi en cours...' : 'Envoyer le lien' }}
          </button>
        </form>
        
        <div class="reset-footer">
          <router-link to="/login" class="link">Retour à la connexion</router-link>
        </div>
      </div>
      
      <!-- Étape 2: Confirmation d'envoi -->
      <div v-if="step === 'sent'" class="reset-step">
        <div class="reset-header">
          <div class="success-icon">✓</div>
          <h1>Email envoyé !</h1>
          <p>Un lien de réinitialisation a été envoyé à <strong>{{ email }}</strong></p>
          <p class="text-muted">Vérifiez votre boîte de réception et vos spams</p>
        </div>
        
        <div class="reset-actions">
          <button
            @click="step = 'request'"
            class="btn btn-secondary"
          >
            Renvoyer un email
          </button>
          <router-link to="/login" class="btn btn-primary">
            Retour à la connexion
          </router-link>
        </div>
      </div>
      
      <!-- Étape 3: Nouveau mot de passe -->
      <div v-if="step === 'reset'" class="reset-step">
        <div class="reset-header">
          <h1>Nouveau mot de passe</h1>
          <p>Choisissez un nouveau mot de passe sécurisé</p>
        </div>
        
        <form @submit.prevent="handlePasswordReset" class="reset-form">
          <div class="form-group">
            <label for="password">Nouveau mot de passe</label>
            <input
              id="password"
              v-model="newPassword"
              type="password"
              required
              :disabled="loading"
              class="form-control"
              placeholder="Minimum 8 caractères"
              minlength="8"
            />
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              :disabled="loading"
              class="form-control"
              placeholder="Répétez le mot de passe"
            />
          </div>
          
          <div v-if="passwordError" class="alert alert-error">
            {{ passwordError }}
          </div>
          
          <button
            type="submit"
            class="btn btn-primary btn-full"
            :disabled="loading || !isPasswordValid"
          >
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe' }}
          </button>
        </form>
      </div>
      
      <!-- Étape 4: Succès -->
      <div v-if="step === 'success'" class="reset-step">
        <div class="reset-header">
          <div class="success-icon">✓</div>
          <h1>Mot de passe mis à jour !</h1>
          <p>Votre mot de passe a été modifié avec succès</p>
        </div>
        
        <div class="reset-actions">
          <router-link to="/login" class="btn btn-primary btn-full">
            Se connecter
          </router-link>
        </div>
      </div>
      
      <!-- Messages d'erreur globaux -->
      <div v-if="error" class="alert alert-error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/auth'

export default {
  name: 'ResetPasswordView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const step = ref('request')
    const loading = ref(false)
    const error = ref('')
    const email = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')
    const passwordError = ref('')
    const resetToken = ref('')
    
    const isPasswordValid = computed(() => {
      if (!newPassword.value || !confirmPassword.value) return false
      if (newPassword.value.length < 8) {
        passwordError.value = 'Le mot de passe doit contenir au moins 8 caractères'
        return false
      }
      if (newPassword.value !== confirmPassword.value) {
        passwordError.value = 'Les mots de passe ne correspondent pas'
        return false
      }
      passwordError.value = ''
      return true
    })
    
    const handleRequestReset = async () => {
      if (!email.value.trim()) return
      
      loading.value = true
      error.value = ''
      
      try {
        await authService.requestPasswordReset(email.value)
        step.value = 'sent'
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    const handlePasswordReset = async () => {
      if (!isPasswordValid.value) return
      
      loading.value = true
      error.value = ''
      
      try {
        await authService.resetPassword(resetToken.value, newPassword.value)
        step.value = 'success'
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    const validateToken = async (token) => {
      loading.value = true
      error.value = ''
      
      try {
        const isValid = await authService.validateResetToken(token)
        if (isValid) {
          resetToken.value = token
          step.value = 'reset'
        } else {
          error.value = 'Le lien de réinitialisation est invalide ou a expiré'
          step.value = 'request'
        }
      } catch (err) {
        error.value = err.message
        step.value = 'request'
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      // Vérifier s'il y a un token dans l'URL
      const token = route.query.token
      if (token) {
        validateToken(token)
      }
    })
    
    return {
      step,
      loading,
      error,
      email,
      newPassword,
      confirmPassword,
      passwordError,
      isPasswordValid,
      handleRequestReset,
      handlePasswordReset
    }
  }
}
</script>

<style scoped>
.reset-password-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.reset-password-container {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.reset-step {
  padding: 3rem 2.5rem;
}

.reset-header {
  text-align: center;
  margin-bottom: 2rem;
}

.reset-header h1 {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.reset-header p {
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.text-muted {
  color: #999 !important;
  font-size: 0.9rem;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #28a745;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1.5rem auto;
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-control {
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.btn {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  text-align: center;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
  transform: translateY(-2px);
}

.btn-full {
  width: 100%;
}

.reset-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reset-footer {
  text-align: center;
  margin-top: 2rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.alert {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .reset-password-view {
    padding: 1rem;
  }
  
  .reset-step {
    padding: 2rem 1.5rem;
  }
  
  .reset-header h1 {
    font-size: 1.5rem;
  }
  
  .reset-actions {
    gap: 0.75rem;
  }
}
</style>