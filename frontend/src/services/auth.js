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
   * Logs in a user by sending credentials to the backend.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<void>} Resolves on successful login; throws an error on failure.
   * @throws {Error} If login fails (e.g., invalid credentials or server error).
   */
  async login(username, password) {
    try {
      // Send login request; backend sets HTTP-only cookie on success
      const response = await api.post(`/auth/login`, {
        username,
        password
      });
      // Return user data from response (e.g., { message, token, user })
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la connexion au serveur';
      throw new Error(message);
    }
  },

  /**
   * Fetches the current authenticated user's information.
   * @returns {Promise<Object|null>} User data if authenticated, null if not authenticated.
   * @throws {Error} If the server request fails unexpectedly.
   */
  async fetchCurrentUser() {
    try {
      const response = await api.get(`/auth/me`);
      return response.data.user; // Return user object from response
    } catch (error) {
      if (error.response?.status === 401) {
        // Expected for unauthenticated users
        return null;
      }
      const message = error.response?.data?.message || 'Erreur lors de la récupération des informations utilisateur';
      throw new Error(message);
    }
  },

  /**
   * Logs out the current user by invalidating the session cookie.
   * @returns {Promise<void>} Resolves on successful logout; logs error but does not throw on failure.
   */
  async logout() {
    try {
      await api.post(`/auth/logout`);
    } catch (error) {
      console.error('Échec de la déconnexion côté serveur:', error.response?.data?.message || error.message);
      // Continue with client-side cleanup (e.g., clearing local state) even if server fails
    }
  },

  /**
   * Updates the current user's profile information.
   * @param {Object} profileData - The profile data to update.
   * @returns {Promise<Object>} Updated user data.
   * @throws {Error} If the update fails.
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put(`/auth/profile`, profileData);
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
      throw new Error(message);
    }
  },

  /**
   * Initiates password reset by sending reset email.
   * @param {string} email - The user's email address.
   * @returns {Promise<void>} Resolves on successful email send.
   * @throws {Error} If the request fails.
   */
  async requestPasswordReset(email) {
    try {
      const response = await api.post(`/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation';
      throw new Error(message);
    }
  },

  /**
   * Resets password using the provided token.
   * @param {string} token - The reset token from email.
   * @param {string} newPassword - The new password.
   * @returns {Promise<void>} Resolves on successful password reset.
   * @throws {Error} If the reset fails.
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(`/auth/reset-password`, {
        token,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe';
      throw new Error(message);
    }
  },

  /**
   * Validates a password reset token.
   * @param {string} token - The reset token to validate.
   * @returns {Promise<boolean>} True if token is valid.
   * @throws {Error} If validation fails.
   */
  async validateResetToken(token) {
    try {
      const response = await api.get(`/auth/validate-reset-token/${token}`);
      return response.data.valid;
    } catch (error) {
      const message = error.response?.data?.message || 'Token de réinitialisation invalide ou expiré';
      throw new Error(message);
    }
  }
};