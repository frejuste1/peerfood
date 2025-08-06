import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import authService from '@/services/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);

  // Computed properties for authentication status and role
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.type === 'admin'); // Adjusted to use 'type' instead of 'role'

  /**
   * Initializes the authentication state by fetching the current user.
   * @returns {Promise<void>}
   */
  const initializeAuth = async () => {
    try {
      const userData = await authService.fetchCurrentUser();
      if (userData) {
        setUser(userData);
      } else {
        clearUserSession();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error.message);
      clearUserSession();
    }
  };

  /**
   * Sets the user data in the store.
   * @param {Object} userData - User data ({ id, username, type }).
   */
  function setUser(userData) {
    user.value = userData;
  }

  /**
   * Clears the user session data.
   */
  function clearUserSession() {
    user.value = null;
  }

  /**
   * Logs in a user with the provided credentials.
   * @param {string} username - The user's username.
   * @param {string} password - The user's password.
   * @returns {Promise<boolean>} True if login succeeds, false otherwise.
   * @throws {Error} If login fails (e.g., invalid credentials).
   */
  async function login(username, password) {
    try {
      const userData = await authService.login(username, password);
      if (userData) {
        setUser(userData);
        return true;
      } else {
        console.error('Erreur: Aucune donnée utilisateur reçue après la connexion.');
        await logout(); // Ensure clean state
        return false;
      }
    } catch (error) {
      console.error('Erreur de connexion:', error.message);
      await logout(); // Ensure clean state on error
      throw new Error(error.message || 'Erreur lors de la connexion au serveur');
    }
  }

  /**
   * Logs out the current user and clears the session.
   * @returns {Promise<void>}
   */
  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion côté serveur:', error.message);
    }
    clearUserSession(); // Always clear client-side state
  }

  /**
   * Updates the current user's profile information.
   * @param {Object} profileData - The profile data to update.
   * @returns {Promise<boolean>} True if update succeeds, false otherwise.
   * @throws {Error} If update fails.
   */
  async function updateProfile(profileData) {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      if (updatedUser) {
        setUser(updatedUser);
        return true;
      } else {
        console.error('Erreur: Aucune donnée utilisateur reçue après la mise à jour.');
        return false;
      }
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error.message);
      throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    setUser,
    login,
    logout,
    updateProfile,
    initializeAuth
  };
});