<template>
  <div class="edit-profile">
    <div class="edit-profile__header">
      <h2>Modifier mon profil</h2>
    </div>
    
    <form @submit.prevent="handleSubmit" class="edit-profile__form">
      <div class="form-group">
        <label for="firstname">Prénom</label>
        <input
          id="firstname"
          v-model="form.firstname"
          type="text"
          required
          :disabled="loading"
          class="form-control"
        />
      </div>
      
      <div class="form-group">
        <label for="lastname">Nom</label>
        <input
          id="lastname"
          v-model="form.lastname"
          type="text"
          required
          :disabled="loading"
          class="form-control"
        />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="loading"
          class="form-control"
        />
      </div>
      
      <div class="form-group">
        <label for="phone">Téléphone</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          :disabled="loading"
          class="form-control"
        />
      </div>
      
      <div class="form-group">
        <label for="username">Nom d'utilisateur</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          required
          :disabled="loading"
          class="form-control"
        />
      </div>
      
      <div class="form-actions">
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn btn-secondary"
          :disabled="loading"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Mise à jour...' : 'Sauvegarder' }}
        </button>
      </div>
    </form>
    
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>
    
    <div v-if="success" class="alert alert-success">
      Profil mis à jour avec succès !
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import authService from '@/services/auth'

export default {
  name: 'EditProfile',
  emits: ['cancel', 'updated'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)
    
    const form = ref({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      username: ''
    })
    
    const isFormValid = computed(() => {
      return form.value.firstname.trim() && 
             form.value.lastname.trim() && 
             form.value.email.trim() && 
             form.value.username.trim()
    })
    
    const loadUserData = () => {
      if (authStore.user) {
        form.value = {
          firstname: authStore.user.firstname || '',
          lastname: authStore.user.lastname || '',
          email: authStore.user.email || '',
          phone: authStore.user.phone || '',
          username: authStore.user.username || ''
        }
      }
    }
    
    const handleSubmit = async () => {
      if (!isFormValid.value) return
      
      loading.value = true
      error.value = ''
      success.value = false
      
      try {
        const updatedUser = await authService.updateProfile(form.value)
        authStore.setUser(updatedUser)
        success.value = true
        emit('updated', updatedUser)
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          success.value = false
        }, 3000)
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadUserData()
    })
    
    return {
      form,
      loading,
      error,
      success,
      isFormValid,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.edit-profile {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.edit-profile__header {
  text-align: center;
  margin-bottom: 2rem;
}

.edit-profile__header h2 {
  color: #333;
  margin: 0;
}

.edit-profile__form {
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
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-control:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.spinner {
  width: 16px;
  height: 16px;
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
  .edit-profile {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>