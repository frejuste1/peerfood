import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8086',
  withCredentials: true, // Cette option est essentielle pour envoyer les cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs de manière globale
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

export default api;