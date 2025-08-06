import axios from 'axios';

// Configuration de base pour l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086';

// Créer une instance axios avec configuration par défaut
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important pour les cookies d'authentification
  timeout: 10000, // Timeout de 10 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter un timestamp pour éviter le cache
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    // Log des requêtes en développement
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    // Log des réponses en développement
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Gestion centralisée des erreurs
    if (error.response) {
      // Erreur de réponse du serveur
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expiré ou invalide - rediriger vers login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('❌ Access forbidden:', data.message);
          break;
        case 404:
          console.error('❌ Resource not found:', data.message);
          break;
        case 422:
          console.error('❌ Validation error:', data.errors);
          break;
        case 500:
          console.error('❌ Server error:', data.message);
          break;
        default:
          console.error(`❌ HTTP ${status}:`, data.message);
      }
      
      // Enrichir l'erreur avec des informations utiles
      error.message = data.message || error.message;
      error.errors = data.errors || null;
    } else if (error.request) {
      // Erreur de réseau
      console.error('❌ Network error:', error.message);
      error.message = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
    } else {
      // Autre erreur
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Méthodes utilitaires pour les appels API courants
export const apiMethods = {
  // GET avec gestion d'erreur
  async get(url, params = {}) {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // POST avec gestion d'erreur
  async post(url, data = {}) {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // PUT avec gestion d'erreur
  async put(url, data = {}) {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // DELETE avec gestion d'erreur
  async delete(url) {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // PATCH avec gestion d'erreur
  async patch(url, data = {}) {
    try {
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Gestion centralisée des erreurs
  handleError(error) {
    if (error.response?.data?.errors) {
      // Erreur de validation - retourner les erreurs de champ
      const fieldErrors = {};
      error.response.data.errors.forEach(err => {
        fieldErrors[err.field] = err.message;
      });
      error.fieldErrors = fieldErrors;
    }
    
    return error;
  }
};

export default api;