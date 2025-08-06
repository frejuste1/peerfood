# Résolution des problèmes CORS dans maCantine

## Problème identifié

Les erreurs CORS suivantes ont été identifiées lors des requêtes entre le frontend Vue.js (http://localhost:5173) et l'API backend (http://localhost:8086) :

```
Access to XMLHttpRequest at 'http://localhost:8086/auth/me' from origin 'http://localhost:5173' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
```

## Solution côté serveur (déjà implémentée)

La configuration CORS dans le fichier `server.js` a été mise à jour pour spécifier l'origine exacte et activer l'option `credentials` :

```javascript
app.use(cors({
    origin: 'http://localhost:5173', // L'origine exacte du frontend
    credentials: true, // Permet l'envoi de cookies entre domaines
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Solution côté client (à implémenter)

Pour résoudre complètement le problème, vous devez également configurer le client Vue.js/Axios pour envoyer les credentials avec les requêtes. Voici comment procéder :

### 1. Configuration globale d'Axios

Dans votre fichier de configuration Axios (probablement dans un fichier comme `api.js` ou similaire), ajoutez l'option `withCredentials: true` :

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8086',
  withCredentials: true, // Cette option est essentielle pour envoyer les cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### 2. Modification des fichiers auth.js et meal.js

Dans les fichiers mentionnés dans les erreurs, assurez-vous que toutes les requêtes utilisent l'instance Axios configurée ou incluent l'option `withCredentials: true` :

#### Pour auth.js

```javascript
// Utiliser l'instance configurée
import api from './api';

export const fetchCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l'utilisateur:', error);
    throw error;
  }
};
```

#### Pour meal.js

```javascript
// Utiliser l'instance configurée
import api from './api';

export const getAll = async () => {
  try {
    const response = await api.get('/meal');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des repas:', error);
    throw new Error('Impossible de récupérer la liste des repas');
  }
};
```

### 3. Si vous utilisez fetch au lieu d'Axios

Si certaines parties de votre code utilisent l'API fetch native, assurez-vous d'inclure l'option `credentials: 'include'` :

```javascript
fetch('http://localhost:8086/auth/me', {
  method: 'GET',
  credentials: 'include', // Équivalent à withCredentials: true pour Axios
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## Vérification

Après avoir implémenté ces modifications :

1. Redémarrez le serveur backend
2. Redémarrez le serveur de développement frontend
3. Vérifiez que les requêtes passent correctement sans erreurs CORS
4. Vérifiez que l'authentification fonctionne comme prévu

## Notes importantes

- L'option `withCredentials: true` est nécessaire pour que les cookies d'authentification soient envoyés avec les requêtes cross-origin
- L'en-tête `Access-Control-Allow-Origin` ne peut pas être `'*'` lorsque `credentials: true` est activé côté serveur
- Si vous changez l'URL du frontend ou du backend, assurez-vous de mettre à jour la configuration CORS en conséquence