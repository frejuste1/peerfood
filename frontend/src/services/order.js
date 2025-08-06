import { apiMethods } from './api.js';

export default {
  async getUserOrders(customerId, options = {}) {
    const { page = 1, limit = 10, status } = options;
    
    try {
      const params = { page, limit };
      if (status) params.status = status;
      
      const response = await apiMethods.get(`/order/customer/${customerId}`, params);
      return {
        orders: response.data || [],
        pagination: response.pagination || {}
      };
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des commandes');
    }
  },

  async getOrderById(orderId) {
    try {
      const response = await apiMethods.get(`/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération de la commande');
    }
  },

  async createOrder(orderData) {
    try {
      const response = await apiMethods.post('/order', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la création de la commande');
    }
  },

  async cancelOrder(orderId, reason = 'Cancelled by user') {
    try {
      const response = await apiMethods.patch(`/order/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de l\'annulation de la commande');
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await apiMethods.put(`/order/${orderId}`, { statut: status });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la mise à jour du statut');
    }
  },

  async getOrderStats(filters = {}) {
    try {
      const response = await apiMethods.get('/order/stats', filters);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des statistiques');
    }
  },

  async getAllOrders(options = {}) {
    const { page = 1, limit = 10, status, customer } = options;
    
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (customer) params.customer = customer;
      
      const response = await apiMethods.get('/order', params);
      return {
        orders: response.data || [],
        pagination: response.pagination || {}
      };
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des commandes');
    }
  },

  async addOrderReview(orderId, reviewData) {
    try {
      const response = await apiMethods.post(`/order/${orderId}/review`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de l\'ajout de l\'avis');
    }
  },

  async getOrderReviews(orderId) {
    try {
      const response = await apiMethods.get(`/order/${orderId}/reviews`);
      return response.data || [];
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la récupération des avis');
    }
  },

  // Méthodes utilitaires pour le formatage
  formatOrderStatus(status) {
    const statusMap = {
      'Unpaid': 'Non payée',
      'Paid': 'Payée',
      'Cancelled': 'Annulée'
    };
    return statusMap[status] || status;
  },

  formatPaymentMethod(method) {
    const methodMap = {
      'MTN MoMo': 'MTN Mobile Money',
      'Orange Money': 'Orange Money',
      'Wave': 'Wave'
    };
    return methodMap[method] || method;
  },

  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  },

  formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Validation côté client
  validateOrderData(orderData) {
    const errors = [];
    
    if (!orderData.plat) errors.push('Plat requis');
    if (!orderData.customer) errors.push('Client requis');
    if (!orderData.category) errors.push('Catégorie requise');
    if (!orderData.price || orderData.price <= 0) errors.push('Prix invalide');
    if (!orderData.deliveryDate) errors.push('Date de livraison requise');
    
    if (orderData.payMethod && !orderData.paymentPhone) {
      errors.push('Numéro de téléphone requis pour le paiement mobile');
    }
    
    return errors;
  },

  // Calculer le délai de livraison
  calculateDeliveryTime(orderDate, deliveryDate) {
    const order = new Date(orderDate);
    const delivery = new Date(deliveryDate);
    const diffTime = Math.abs(delivery - order);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Demain';
    if (diffDays === 0) return 'Aujourd\'hui';
    return `Dans ${diffDays} jours`;
  },

  // Vérifier si une commande peut être annulée
  canCancelOrder(order) {
    if (order.statut === 'Paid' || order.statut === 'Cancelled') {
      return false;
    }
    
    // Vérifier si la deadline de paiement n'est pas dépassée
    const now = new Date();
    const deadline = new Date(order.paymentDeadline);
    
    return now < deadline;
  },

  // Obtenir le temps restant pour le paiement
  getPaymentTimeRemaining(paymentDeadline) {
    const now = new Date();
    const deadline = new Date(paymentDeadline);
    const diffTime = deadline - now;
    
    if (diffTime <= 0) return 'Expiré';
    
    const hours = Math.floor(diffTime / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }
};

    try {
      const response = await api.get('/orders/admin/all');
      return response.data.orders;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la récupération des commandes';
      throw new Error(message);
    }
  }
};