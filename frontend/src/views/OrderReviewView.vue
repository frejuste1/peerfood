<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import OrderService from '@/services/order';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const order = ref(null);
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref(null);
const success = ref(false);

const reviewForm = ref({
  rating: 5,
  comment: '',
  items: [] // Avis par article
});

const loadOrder = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const orderId = route.params.id;
    order.value = await OrderService.getOrderById(orderId);
    
    // Initialiser les avis par article
    reviewForm.value.items = order.value.items.map(item => ({
      itemId: item.id,
      mealId: item.meal.id,
      mealName: item.meal.designation,
      rating: 5,
      comment: ''
    }));
  } catch (err) {
    error.value = 'Erreur lors du chargement de la commande';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const submitReview = async () => {
  try {
    isSubmitting.value = true;
    error.value = null;
    
    const reviewData = {
      overallRating: reviewForm.value.rating,
      overallComment: reviewForm.value.comment,
      itemReviews: reviewForm.value.items.map(item => ({
        mealId: item.mealId,
        rating: item.rating,
        comment: item.comment
      }))
    };
    
    await OrderService.addOrderReview(order.value.id, reviewData);
    success.value = true;
    
    // Rediriger vers l'historique après 2 secondes
    setTimeout(() => {
      router.push('/order-history');
    }, 2000);
  } catch (err) {
    error.value = 'Erreur lors de l\'envoi de l\'avis';
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push('/order-history');
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  await loadOrder();
});
</script>

<template>
  <div class="order-review">
    <div class="review-header">
      <button @click="goBack" class="back-button">
        ← Retour à l'historique
      </button>
      <h1>Laisser un avis</h1>
    </div>

    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <div v-if="success" class="alert alert-success">
      Merci pour votre avis ! Redirection en cours...
    </div>

    <div v-if="isLoading" class="loading">
      Chargement de la commande...
    </div>

    <div v-else-if="order" class="review-content">
      <div class="order-summary">
        <h2>Commande #{{ order.id }}</h2>
        <p class="order-date">Commandée le {{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</p>
        <p class="order-total">Total: {{ order.total }} XOF</p>
      </div>

      <form @submit.prevent="submitReview" class="review-form">
        <!-- Avis général -->
        <div class="overall-review">
          <h3>Avis général sur la commande</h3>
          
          <div class="rating-group">
            <label>Note générale:</label>
            <div class="star-rating">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="reviewForm.rating = star"
                :class="['star', { active: star <= reviewForm.rating }]"
              >
                ★
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="overall-comment">Commentaire général (optionnel):</label>
            <textarea
              id="overall-comment"
              v-model="reviewForm.comment"
              rows="3"
              placeholder="Partagez votre expérience générale..."
              class="form-control"
            ></textarea>
          </div>
        </div>

        <!-- Avis par article -->
        <div class="items-review">
          <h3>Avis sur chaque plat</h3>
          
          <div v-for="item in reviewForm.items" :key="item.itemId" class="item-review">
            <div class="item-header">
              <h4>{{ item.mealName }}</h4>
            </div>
            
            <div class="rating-group">
              <label>Note:</label>
              <div class="star-rating">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="item.rating = star"
                  :class="['star', { active: star <= item.rating }]"
                >
                  ★
                </button>
              </div>
            </div>

            <div class="form-group">
              <label :for="`comment-${item.itemId}`">Commentaire (optionnel):</label>
              <textarea
                :id="`comment-${item.itemId}`"
                v-model="item.comment"
                rows="2"
                :placeholder="`Votre avis sur ${item.mealName}...`"
                class="form-control"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="goBack" class="btn btn-secondary" :disabled="isSubmitting">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="spinner"></span>
            {{ isSubmitting ? 'Envoi...' : 'Envoyer l\'avis' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.order-review {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.review-header {
  margin-bottom: 2rem;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #0056b3;
  text-decoration: underline;
}

.review-header h1 {
  color: #333;
  margin: 0;
}

.alert {
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
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

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.order-summary {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.order-summary h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.order-date, .order-total {
  margin: 0.25rem 0;
  color: #666;
}

.order-total {
  font-weight: 600;
  color: #333;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.overall-review, .items-review {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.overall-review h3, .items-review h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.item-review {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.item-review:last-child {
  margin-bottom: 0;
}

.item-header h4 {
  margin: 0 0 1rem 0;
  color: #333;
}

.rating-group {
  margin-bottom: 1rem;
}

.rating-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
}

.star {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
}

.star:hover,
.star.active {
  color: #ffc107;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  resize: vertical;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
  .order-review {
    margin: 1rem;
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
  
  .star {
    font-size: 1.25rem;
  }
}
</style>