<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Meal from '../services/meal.js';

const route = useRoute();
const meal = ref(null);
const reviews = ref([]);
const loading = ref(true);
const error = ref(null);
const showReviewForm = ref(false);
const newReview = ref({
  rating: 5,
  comment: ''
});

const nutritionalInfo = ref({
  calories: 0,
  proteins: 0,
  carbs: 0,
  fats: 0,
  allergens: []
});

const fetchMealDetails = async () => {
  try {
    loading.value = true;
    const mealData = await Meal.getById(route.params.id);
    
    // Vérifier si le repas est dans les favoris
    const storedFavorites = localStorage.getItem('mealFavorites');
    const favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
    mealData.isFavorite = favorites.includes(mealData.id);
    
    meal.value = mealData;
    
    // Simuler le chargement des informations nutritionnelles
    nutritionalInfo.value = {
      calories: 650,
      proteins: 25,
      carbs: 85,
      fats: 15,
      allergens: ['Gluten', 'Lait']
    };
    
    // Simuler le chargement des avis
    reviews.value = [
      { id: 1, username: 'Sophie', rating: 5, comment: 'Délicieux ! Un de mes plats préférés.', date: '2024-01-15' },
      { id: 2, username: 'Marc', rating: 4, comment: 'Très bon rapport qualité-prix.', date: '2024-01-14' }
    ];
  } catch (e) {
    error.value = 'Erreur lors du chargement des détails du plat';
  } finally {
    loading.value = false;
  }
};

const submitReview = async () => {
  // TODO: Implémenter l'envoi de l'avis au serveur
  reviews.value.unshift({
    id: Date.now(),
    username: 'Utilisateur',
    rating: newReview.value.rating,
    comment: newReview.value.comment,
    date: new Date().toISOString().split('T')[0]
  });
  newReview.value = { rating: 5, comment: '' };
  showReviewForm.value = false;
};

const toggleFavorite = async () => {
  if (!meal.value) return;
  
  meal.value.isFavorite = !meal.value.isFavorite;
  
  // Récupérer les favoris actuels du localStorage
  const storedFavorites = localStorage.getItem('mealFavorites');
  let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
  
  if (meal.value.isFavorite) {
    // Ajouter aux favoris s'il n'y est pas déjà
    if (!favorites.includes(meal.value.id)) {
      favorites.push(meal.value.id);
    }
  } else {
    // Retirer des favoris
    const index = favorites.indexOf(meal.value.id);
    if (index !== -1) {
      favorites.splice(index, 1);
    }
  }
  
  // Sauvegarder dans localStorage
  localStorage.setItem('mealFavorites', JSON.stringify(favorites));
};

onMounted(() => {
  fetchMealDetails();
});
</script>

<template>
  <div class="meal-detail-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Chargement des détails...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="meal" class="meal-detail">
      <div class="meal-header">
        <img :src="meal.image" :alt="meal.designation" class="meal-image">
        <div class="meal-info">
          <div class="meal-title-section">
            <h1>{{ meal.designation }}</h1>
            <button @click="toggleFavorite" class="favorite-button">
              <span v-if="meal.isFavorite">❤️</span>
              <span v-else>🤍</span>
            </button>
          </div>
          <p class="meal-description">{{ meal.description }}</p>
          <p class="meal-price">{{ meal.price }} XOF</p>
        </div>
      </div>

      <div class="nutritional-info">
        <h2>Informations Nutritionnelles</h2>
        <div class="nutrition-grid">
          <div class="nutrition-item">
            <span class="value">{{ nutritionalInfo.calories }}</span>
            <span class="label">Calories</span>
          </div>
          <div class="nutrition-item">
            <span class="value">{{ nutritionalInfo.proteins }}g</span>
            <span class="label">Protéines</span>
          </div>
          <div class="nutrition-item">
            <span class="value">{{ nutritionalInfo.carbs }}g</span>
            <span class="label">Glucides</span>
          </div>
          <div class="nutrition-item">
            <span class="value">{{ nutritionalInfo.fats }}g</span>
            <span class="label">Lipides</span>
          </div>
        </div>

        <div class="allergens">
          <h3>Allergènes</h3>
          <div class="allergen-tags">
            <span v-for="allergen in nutritionalInfo.allergens" :key="allergen" class="allergen-tag">
              {{ allergen }}
            </span>
          </div>
        </div>
      </div>

      <div class="reviews-section">
        <div class="reviews-header">
          <h2>Avis des clients</h2>
          <button @click="showReviewForm = true" class="add-review-button">
            Ajouter un avis
          </button>
        </div>

        <div v-if="showReviewForm" class="review-form">
          <div class="rating-input">
            <label>Note :</label>
            <div class="stars">
              <button 
                v-for="star in 5" 
                :key="star"
                @click="newReview.rating = star"
                :class="{ active: star <= newReview.rating }"
              >
                ⭐
              </button>
            </div>
          </div>
          <textarea 
            v-model="newReview.comment"
            placeholder="Partagez votre expérience..."
            rows="4"
          ></textarea>
          <div class="form-buttons">
            <button @click="submitReview" class="submit-button">Publier</button>
            <button @click="showReviewForm = false" class="cancel-button">Annuler</button>
          </div>
        </div>

        <div class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <span class="username">{{ review.username }}</span>
              <span class="date">{{ review.date }}</span>
            </div>
            <div class="rating">
              <span v-for="star in review.rating" :key="star">⭐</span>
            </div>
            <p class="comment">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.meal-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary);
}

/* Style pour le bouton de favoris */
.favorite-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.favorite-button:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.9);
}

.meal-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.meal-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.meal-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
}

.meal-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.meal-title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.favorite-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.favorite-button:hover {
  transform: scale(1.2);
}

.nutritional-info {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.nutrition-item {
  text-align: center;
}

.nutrition-item .value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
}

.nutrition-item .label {
  font-size: 0.9rem;
  color: var(--gray-400);
}

.allergens {
  margin-top: var(--spacing-lg);
}

.allergen-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.allergen-tag {
  background: var(--gray-100);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.reviews-section {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.add-review-button {
  background: var(--primary);
  color: var(--white);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-review-button:hover {
  background: var(--orange-400);
  transform: translateY(-2px);
}

.review-form {
  background: var(--gray-100);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
}

.rating-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.stars button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s ease;
}

.stars button.active {
  opacity: 1;
}

textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  resize: vertical;
  margin-bottom: var(--spacing-md);
}

.form-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.submit-button,
.cancel-button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button {
  background: var(--success);
  color: var(--white);
}

.cancel-button {
  background: var(--gray-300);
  color: var(--gray-700);
}

.reviews-list {
  display: grid;
  gap: var(--spacing-md);
}

.review-card {
  background: var(--gray-50);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-200);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.username {
  font-weight: 600;
  color: var(--gray-700);
}

.date {
  color: var(--gray-400);
  font-size: 0.9rem;
}

.rating {
  margin-bottom: var(--spacing-sm);
}

.comment {
  color: var(--gray-600);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .meal-header {
    grid-template-columns: 1fr;
  }

  .meal-image {
    height: 300px;
  }

  .nutrition-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>