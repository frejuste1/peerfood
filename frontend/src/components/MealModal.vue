<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  meal: {
    type: Object,
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <button class="close-button" @click="closeModal">×</button>
      
      <div class="meal-details">
        <div class="meal-image">
          <img :src="meal.imagePath" :alt="meal.designation">
        </div>
        
        <div class="meal-info">
          <h2>{{ meal.designation }}</h2>
          <p class="description">{{ meal.description }}</p>
          <p class="price">Prix: {{ new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF'
          }).format(meal.price) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideIn 0.3s ease;
}

.close-button {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-400);
  transition: color 0.3s ease;
}

.close-button:hover {
  color: var(--gray-500);
}

.meal-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.meal-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: var(--border-radius);
}

.meal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-info {
  flex: 1;
}

.meal-info h2 {
  color: var(--gray-500);
  margin-bottom: var(--spacing-md);
  font-size: 1.5rem;
}

.description {
  color: var(--gray-400);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.price {
  font-size: 1.2rem;
  color: var(--primary);
  font-weight: 600;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (min-width: 768px) {
  .meal-details {
    flex-direction: row;
  }

  .meal-image {
    width: 50%;
  }
}
</style>