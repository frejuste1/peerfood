import api from './api.js';

/**
 * Fonctions pour gérer les repas avec l'API
 */

/**
 * Récupère tous les repas
 * @returns {Promise} - Promesse contenant la liste des repas
 */
export const getAll = async () => {
  try {
    const response = await api.get('/meal');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des repas:', error);
    throw new Error('Impossible de récupérer la liste des repas');
  }
};

/**
 * Récupère un repas par son ID
 * @param {number} id - ID du repas
 * @returns {Promise} - Promesse contenant les données du repas
 */
export const getById = async (id) => {
  try {
    const response = await api.get(`/meal/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du repas ${id}:`, error);
    throw new Error(`Impossible de récupérer le repas ${id}`);
  }
};

/**
 * Crée un nouveau repas
 * @param {Object} mealData - Données du repas à créer
 * @returns {Promise} - Promesse contenant les données du repas créé
 */
export const create = async (mealData) => {
  try {
    const response = await api.post('/meal', mealData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du repas:', error);
    throw new Error('Impossible de créer le repas');
  }
};