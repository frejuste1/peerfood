# 🍽️ PeerFood - Système de Gestion de Cantine Scolaire

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.18+-blue.svg)](https://expressjs.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-v3.0+-4FC08D.svg)](https://vuejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-v8.0+-orange.svg)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6.0+-52B0E7.svg)](https://sequelize.org/)

**PeerFood** est une application complète de gestion de cantine scolaire permettant aux étudiants et enseignants de commander leurs repas en ligne avec un système de paiement mobile intégré.

## 📋 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies](#️-technologies)
- [📦 Installation](#-installation)
- [🚀 Démarrage Rapide](#-démarrage-rapide)
- [🔧 Configuration](#-configuration)
- [📚 API Documentation](#-api-documentation)
- [🏫 Utilisation](#-utilisation)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

## ✨ Fonctionnalités

### 👥 Gestion des Utilisateurs

- 🔐 **Authentification sécurisée** avec JWT
- 👨‍🎓 **Multi-rôles** : Étudiants, Enseignants, Gestionnaires, Administrateurs
- 📱 **Profils personnalisés** avec informations de contact

### 🍽️ Catalogue de Repas

- 📋 **Menu dynamique** avec description détaillée
- 🥕 **Composition des plats** (ingrédients, quantités)
- 💰 **Gestion des prix** et disponibilité
- 📸 **Images des plats**

### 🛒 Système de Commandes

- 🛍️ **Commandes en ligne** avec panier
- 📅 **Planification** des repas par date
- 🔄 **Suivi en temps réel** des statuts
- ⏰ **Dates limites** de commande et livraison

### 💳 Paiements Mobiles

- 📱 **MTN Mobile Money** intégration
- 🟠 **Orange Money** support
- 🌊 **Wave** paiements
- 💵 **Suivi des transactions** et relances automatiques

### 📊 Administration

- 📈 **Tableau de bord** avec statistiques
- 🏪 **Gestion des fournisseurs**
- 📦 **Approvisionnement** et stock
- 📋 **Rapports** de ventes et commandes

## 🏗️ Architecture

```
📦 peerfood/
├── 🎯 backend/                 # API Express.js + Sequelize
│   ├── 📁 App/                 # Application 
│   │   ├── 📁 Configs/         # Configuration base de données
│   │   ├── 📁 Controllers/     # Logique métier
│   │   ├── 📁 Models/          # Modèles Sequelize
│   │   ├── 📁 Routes/          # Routes API
│   │   ├── 📁 Middleware/      # Authentification, validation
│   │   ├── 📁 Services/        # Services métier
│   │   ├── 📁 Utils/           # Fontionnalités Utilitaires (Logger, API Features, etc)
│   │   └── 📄 app.js           # Application Express
│   ├── 📁 Public/               # Public file
│   ├── 📁 Views/                  # Views ejs 
│   ├── package.json            # Dépendances
│   ├── 📄 ecosystem.config.js  # Configuration PM2
│   ├── 📄 .env                 # Variables d'environnement
│   └── 📄 server.js            # Point d'entrée
├── 🖥️ frontend/                # Interface Vue.js
│   ├── 📁 src/
│   │   ├── 📁 components/    # Composants réutilisables
│   │   ├── 📁 views/         # Pages de l'application
│   │   ├── 📁 router/        # Routage Vue Router
│   │   ├── 📁 store/         # Gestion d'état Pinia
│   │   └── 📁 services/      # Services API
│   └── 📄 package.json
├── 📊 database/               # Scripts SQL et migrations
│   ├── 📄 peerfood.sql        # Structure initiale
│   └── 📁 migrations/         # Migrations Sequelize
├── 📄 package.json            # Gestion des dépendances
├── 📄 README.md               # Ce README 
├── 📄 LICENSE                 # Licence
├── 📄 .gitignore              # Fichiers à ignorer
└── 📋 docs/                   # Documentation
```

## 🛠️ Technologies

### Backend

- **Node.js** (v18+) - Runtime JavaScript
- **Express.js** (v4.18+) - Framework web
- **Sequelize** (v6.0+) - ORM pour MySQL
- **MySQL** (v8.0+) - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Multer** - Upload de fichiers
- **Cors** - Gestion CORS

### Frontend

- **Vue.js** (v3.0+) - Framework JavaScript
- **Vue Router** - Routage SPA
- **Pinia** - Gestion d'état
- **Axios** - Client HTTP
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool

### DevOps & Outils

- **Nodemon** - Rechargement automatique
- **ESLint** - Linting JavaScript
- **Prettier** - Formatage de code
- **Jest** - Tests unitaires

## 📦 Installation

### Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8.0 ou supérieur)
- npm ou yarn

### 1. 📥 Cloner le Projet

```bash
git clone https://github.com/your-username/peerfood.git
cd peerfood
```

### 2. 🔧 Installation Backend

```bash
cd backend
npm install
```

### 3. 🎨 Installation Frontend

```bash
cd ../frontend
npm install
```

### 4. 🗄️ Configuration Base de Données

```bash
# Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE peerfood;
USE peerfood;
SOURCE database/peerfood.sql;
```

## 🚀 Démarrage Rapide

### 1. ⚙️ Configuration Environnement

Créer le fichier `backend/.env` :
```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peerfood
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=8090
NODE_ENV=development

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Mobile Money APIs (à configurer selon vos providers)
MTN_MOMO_API_KEY=your_mtn_api_key
ORANGE_MONEY_API_KEY=your_orange_api_key
WAVE_API_KEY=your_wave_api_key
```

### 2. 🚀 Lancer l'Application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
# Server running on http://localhost:8090
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

### 3. 🎉 Accès à l'Application

- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **API Backend** : [http://localhost:8090](http://localhost:8090)
- **API Docs** : [http://localhost:8090/api-docs](http://localhost:8090/api-docs)

## 🔧 Configuration

### Base de Données

Le fichier `backend/config/database.js` contient la configuration Sequelize :
```javascript
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
}
```

### Authentification

- **JWT** pour l'authentification stateless
- **Bcrypt** pour le hashage des mots de passe
- **Middleware** de protection des routes

### Paiements Mobiles

Configuration dans `backend/services/payments/` :

- MTN Mobile Money
- Orange Money  
- Wave

## 📚 API Documentation

### 🔐 Authentification

```bash
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/profile
```

### 👥 Utilisateurs

```bash
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### 🍽️ Plats

```bash
GET    /api/plats
POST   /api/plats
PUT    /api/plats/:id
DELETE /api/plats/:id
GET    /api/plats/:id/ingredients
```

### 🛒 Commandes

```bash
GET    /api/orders
POST   /api/orders
PUT    /api/orders/:id
GET    /api/orders/:id/status
```

### 💳 Paiements

```bash
POST   /api/payments/initiate
GET    /api/payments/:id/status
POST   /api/payments/webhook
```

## 🏫 Utilisation

### Pour les Étudiants/Enseignants

1. **Inscription** avec email et informations personnelles
2. **Connexion** au système
3. **Navigation** dans le catalogue de repas
4. **Commande** de repas avec sélection de date
5. **Paiement** via mobile money
6. **Suivi** de la commande jusqu'à livraison

### Pour les Gestionnaires

1. **Gestion** du catalogue (ajout/modification de plats)
2. **Suivi** des commandes en temps réel
3. **Gestion** des stocks et approvisionnements
4. **Consultation** des rapports de ventes

### Pour les Administrateurs

1. **Gestion** complète des utilisateurs
2. **Configuration** du système
3. **Accès** aux statistiques avancées
4. **Maintenance** de la base de données

## 🧪 Tests

```bash
# Tests Backend
cd backend
npm test

# Tests Frontend
cd frontend
npm run test

# Coverage
npm run test:coverage
```

## 📱 Scripts Utiles

```bash
# Backend
npm run dev          # Développement avec nodemon
npm run start        # Production
npm run migrate      # Exécuter les migrations
npm run seed         # Données de test

# Frontend
npm run dev          # Serveur de développement
npm run build        # Build pour production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```

## 🚀 Déploiement

### Production avec PM2

```bash
# Backend
cd backend
npm install -g pm2
pm2 start ecosystem.config.js

# Frontend (build)
cd frontend
npm run build
# Servir dist/ avec nginx ou apache
```

### Docker (optionnel)

```bash
docker-compose up -d
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### 📝 Conventions de Code

- **ESLint** + **Prettier** pour le formatage
- **Commits conventionnels** (feat, fix, docs, etc.)
- **Tests** pour toute nouvelle fonctionnalité

## 📞 Support

- 📧 **Email** : [keifrejuste26@gmail.com](mailto:keifrejuste26@gmail.com)
- 📱 **WhatsApp** : +225 05 46 93 05 47
- 📚 **Documentation** : [docs.peerfood.com](https://docs.peerfood.com)
- 🐛 **Issues** : [GitHub Issues](https://github.com/your-username/peerfood/issues)

## 👥 Équipe

- **Développeur Principal** : Kei Mansou Prince Frejuste
- **UI/UX Designer** : Kei Mansou Prince Frejuste
- **Chef de Projet** : Kei Mansou Prince Frejuste

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

### Fait avec ❤️ pour l'éducation en Côte d'Ivoire

[⭐ Star ce projet](https://github.com/Frejuste26/peerfood) • [🐛 Reporter un bug](https://github.com/Frejuste26/peerfood/issues) • [💡 Demander une fonctionnalité](https://github.com/Frejuste26/peerfood/issues)

</div>