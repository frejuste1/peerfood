import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086';

// Créer une instance axios avec la configuration CORS appropriée
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Essentiel pour envoyer les cookies avec les requêtes cross-origin
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default {
  /**
   * Récupère l'historique des commandes de l'utilisateur connecté
   * @returns {Promise<Array>} Liste des commandes de l'utilisateur
   * @throws {Error} Si la récupération échoue
   */
  async getUserOrders() {
    try {
      const response = await api.get('/orders/user');
      return response.data.orders;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la récupération des commandes';
      throw new Error(message);
    }
  },

  /**
   * Récupère les détails d'une commande spécifique
   * @param {number} orderId - ID de la commande
   * @returns {Promise<Object>} Détails de la commande
   * @throws {Error} Si la récupération échoue
   */
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la récupération de la commande';
      throw new Error(message);
    }
  },

  /**
   * Crée une nouvelle commande
   * @param {Object} orderData - Données de la commande
   * @returns {Promise<Object>} Commande créée
   * @throws {Error} Si la création échoue
   */
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la création de la commande';
      throw new Error(message);
    }
  },

  /**
   * Annule une commande
   * @param {number} orderId - ID de la commande à annuler
   * @returns {Promise<Object>} Commande mise à jour
   * @throws {Error} Si l'annulation échoue
   */
  async cancelOrder(orderId) {
    try {
      const response = await api.patch(`/orders/${orderId}/cancel`);
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'annulation de la commande';
      throw new Error(message);
    }
  },

  /**
   * Met à jour le statut d'une commande (pour les admins)
   * @param {number} orderId - ID de la commande
   * @param {string} status - Nouveau statut
   * @returns {Promise<Object>} Commande mise à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour du statut';
      throw new Error(message);
    }
  },

  /**
   * Ajoute un avis sur une commande
   * @param {number} orderId - ID de la commande
   * @param {Object} reviewData - Données de l'avis (rating, comment)
   * @returns {Promise<Object>} Avis créé
   * @throws {Error} Si l'ajout échoue
   */
  async addOrderReview(orderId, reviewData) {
    try {
      const response = await api.post(`/orders/${orderId}/review`, reviewData);
      return response.data.review;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avis';
      throw new Error(message);
    }
  },

  /**
   * Récupère les avis d'une commande
   * @param {number} orderId - ID de la commande
   * @returns {Promise<Array>} Liste des avis
   * @throws {Error} Si la récupération échoue
   */
  async getOrderReviews(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/reviews`);
      return response.data.reviews;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la récupération des avis';
      throw new Error(message);
    }
  },

  /**
   * Met à jour un avis
   * @param {number} reviewId - ID de l'avis
   * @param {Object} reviewData - Nouvelles données de l'avis
   * @returns {Promise<Object>} Avis mis à jour
   * @throws {Error} Si la mise à jour échoue
   */
  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.patch(`/reviews/${reviewId}`, reviewData);
      return response.data.review;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour de l\'avis';
      throw new Error(message);
    }
  },

  /**
   * Supprime un avis
   * @param {number} reviewId - ID de l'avis à supprimer
   * @returns {Promise<void>}
   * @throws {Error} Si la suppression échoue
   */
  async deleteReview(reviewId) {
    try {
      await api.delete(`/reviews/${reviewId}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la suppression de l\'avis';
      throw new Error(message);
    }
  },

  /**
   * Récupère toutes les commandes (pour les admins)
   * @returns {Promise<Array>} Liste de toutes les commandes
   * @throws {Error} Si la récupération échoue
   */
  async getAllOrders() {
    try {
      const response = await api.get('/orders/admin/all');
      return response.data.orders;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la récupération des commandes';
      throw new Error(message);
    }
  }
};