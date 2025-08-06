import api from './api.js';

/**
 * Fonctions pour gérer l'authentification avec l'API
 */

/**
 * Connecte un utilisateur avec ses identifiants
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise} - Promesse contenant les données de l'utilisateur connecté
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Récupère les informations de l'utilisateur actuellement connecté
 * @returns {Promise} - Promesse contenant les données de l'utilisateur
 */
export const fetchCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur actuel
 * @returns {Promise} - Promesse contenant le statut de déconnexion
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};