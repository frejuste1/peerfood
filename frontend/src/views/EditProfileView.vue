<template>
  <div class="edit-profile-view">
    <div class="edit-profile-container">
      <div class="breadcrumb">
        <router-link to="/profile" class="breadcrumb-link">
          ← Retour au profil
        </router-link>
      </div>
      
      <EditProfile
        @cancel="handleCancel"
        @updated="handleProfileUpdated"
      />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import EditProfile from '@/components/EditProfile.vue'

export default {
  name: 'EditProfileView',
  components: {
    EditProfile
  },
  setup() {
    const router = useRouter()
    
    const handleCancel = () => {
      router.push('/profile')
    }
    
    const handleProfileUpdated = (updatedUser) => {
      // Rediriger vers le profil après mise à jour réussie
      setTimeout(() => {
        router.push('/profile')
      }, 2000) // Laisser le temps de voir le message de succès
    }
    
    return {
      handleCancel,
      handleProfileUpdated
    }
  }
}
</script>

<style scoped>
.edit-profile-view {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem 0;
}

.edit-profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.breadcrumb {
  margin-bottom: 2rem;
}

.breadcrumb-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.breadcrumb-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .edit-profile-view {
    padding: 1rem 0;
  }
  
  .edit-profile-container {
    padding: 0 0.5rem;
  }
}
</style>