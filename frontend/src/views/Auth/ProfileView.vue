<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const userData = computed(() => authStore.user || {})

const handleEditProfile = () => {
  router.push('/profile/edit')
}
</script>

<template>
  <main id="profile-container">
    <div class="profile-header">
      <h1>Mon Profil</h1>
      <button @click="handleEditProfile" class="btn btn-primary">
        Modifier mon profil
      </button>
    </div>

    <div class="profile-section">
      <h3>Informations personnelles</h3>
      <div class="info-group">
        <label>Nom</label>
        <p>{{ userData.lastname || 'Non renseigné' }}</p>
      </div>
      <div class="info-group">
        <label>Prénom</label>
        <p>{{ userData.firstname || 'Non renseigné' }}</p>
      </div>
    </div>

    <div class="profile-section">
      <h3>Coordonnées</h3>
      <div class="info-group">
        <label>Téléphone</label>
        <p>{{ userData.phone || 'Non renseigné' }}</p>
      </div>
      <div class="info-group">
        <label>Email</label>
        <p>{{ userData.email || 'Non renseigné' }}</p>
      </div>
    </div>

    <div class="profile-section">
      <h3>Identifiants</h3>
      <div class="info-group">
        <label>Nom d'utilisateur</label>
        <p>{{ userData.username || 'Non renseigné' }}</p>
      </div>
      <div class="info-group">
        <label>Type de compte</label>
        <p>{{ userData.type === 'admin' ? 'Administrateur' : 'Utilisateur' }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
#profile-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

h1 {
  color: #2c3e50;
  margin: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
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

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

.profile-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.info-group {
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.info-group label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.info-group p {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0;
}
</style>