# Guide de Déploiement PeerFood

## Prérequis

- Node.js 18+ 
- MySQL 8.0+
- PM2 (pour la production)
- Nginx (recommandé pour la production)

## Déploiement en développement

### 1. Installation

```bash
# Cloner le projet
git clone https://github.com/Frejuste26/peerfood.git
cd peerfood

# Installer toutes les dépendances
npm run install:all

# Configurer l'environnement
npm run setup:env
```

### 2. Configuration de la base de données

```bash
# Créer la base de données
mysql -u root -p
CREATE DATABASE peerfood CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE peerfood;
SOURCE peerfood.sql;
```

### 3. Configuration des variables d'environnement

Éditer le fichier `backend/.env`:

```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=peerfood
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# Serveur
PORT=8086
NODE_ENV=development

# Paiements mobiles
WAVE_API_KEY=your_wave_api_key
MTN_MOMO_API_KEY=your_mtn_api_key
ORANGE_MONEY_API_KEY=your_orange_api_key
```

### 4. Démarrage

```bash
# Démarrer en mode développement (backend + frontend)
npm run dev

# Ou séparément
npm run dev:backend  # Backend sur http://localhost:8086
npm run dev:frontend # Frontend sur http://localhost:5173
```

## Déploiement en production

### 1. Préparation du serveur

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Installation de PM2
sudo npm install -g pm2

# Installation de Nginx
sudo apt install nginx -y
```

### 2. Configuration de la base de données

```bash
# Créer un utilisateur dédié
sudo mysql
CREATE USER 'peerfood'@'localhost' IDENTIFIED BY 'secure_password';
CREATE DATABASE peerfood CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON peerfood.* TO 'peerfood'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Déploiement de l'application

```bash
# Cloner le projet
cd /var/www
sudo git clone https://github.com/Frejuste26/peerfood.git
sudo chown -R $USER:$USER peerfood
cd peerfood

# Installation des dépendances
npm run install:all

# Configuration de l'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec les bonnes valeurs

# Build du frontend
cd frontend
npm run build
cd ..

# Démarrage avec PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 4. Configuration Nginx

Créer `/etc/nginx/sites-available/peerfood`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (fichiers statiques)
    location / {
        root /var/www/peerfood/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache des assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Backend
    location /api/ {
        proxy_pass http://localhost:8086/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

Activer le site:
```bash
sudo ln -s /etc/nginx/sites-available/peerfood /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL avec Let's Encrypt

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL
sudo certbot --nginx -d your-domain.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Configuration Docker (Optionnel)

### Dockerfile Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend/ .

EXPOSE 8086

USER node

CMD ["npm", "start"]
```

### Dockerfile Frontend

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: peerfood
      MYSQL_USER: peerfood
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./peerfood.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      DB_USER: peerfood
      DB_PASSWORD: password
      DB_NAME: peerfood
    depends_on:
      - mysql
    ports:
      - "8086:8086"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

## Monitoring et Logs

### Configuration des logs avec PM2

```bash
# Voir les logs en temps réel
pm2 logs peerfood-api

# Logs avec rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### Monitoring avec PM2 Plus

```bash
# Connecter à PM2 Plus pour le monitoring
pm2 link your_secret_key your_public_key
```

## Sauvegarde

### Script de sauvegarde automatique

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/peerfood"
DB_NAME="peerfood"
DB_USER="peerfood"
DB_PASS="password"

# Créer le répertoire de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde de la base de données
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Sauvegarde des fichiers uploadés
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz /var/www/peerfood/backend/uploads

# Nettoyer les anciennes sauvegardes (garder 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Sauvegarde terminée: $DATE"
```

Programmer la sauvegarde:
```bash
sudo crontab -e
# Ajouter: 0 2 * * * /path/to/backup.sh
```

## Mise à jour

### Mise à jour en production

```bash
# Sauvegarder avant la mise à jour
./backup.sh

# Récupérer les dernières modifications
git pull origin main

# Installer les nouvelles dépendances
npm run install:all

# Build du frontend
cd frontend && npm run build && cd ..

# Redémarrer l'application
pm2 reload ecosystem.config.js --env production

# Vérifier que tout fonctionne
pm2 status
pm2 logs peerfood-api --lines 50
```

## Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   ```bash
   # Vérifier le statut de MySQL
   sudo systemctl status mysql
   
   # Vérifier les logs
   sudo tail -f /var/log/mysql/error.log
   ```

2. **Application qui ne démarre pas**
   ```bash
   # Vérifier les logs PM2
   pm2 logs peerfood-api
   
   # Redémarrer l'application
   pm2 restart peerfood-api
   ```

3. **Problèmes de permissions**
   ```bash
   # Corriger les permissions
   sudo chown -R $USER:$USER /var/www/peerfood
   chmod -R 755 /var/www/peerfood
   ```

### Commandes utiles

```bash
# Statut de l'application
pm2 status

# Redémarrer l'application
pm2 restart peerfood-api

# Voir les métriques
pm2 monit

# Recharger la configuration Nginx
sudo nginx -s reload

# Vérifier la configuration Nginx
sudo nginx -t
```

## Sécurité

### Recommandations de sécurité

1. **Firewall**
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   sudo ufw allow 3306 # MySQL (seulement si accès externe nécessaire)
   ```

2. **Mise à jour régulière**
   ```bash
   # Mettre à jour les dépendances
   npm audit fix
   
   # Mettre à jour le système
   sudo apt update && sudo apt upgrade
   ```

3. **Variables d'environnement sécurisées**
   - Utiliser des mots de passe forts
   - Changer les clés JWT par défaut
   - Configurer HTTPS en production
   - Limiter les accès à la base de données

## Performance

### Optimisations recommandées

1. **Base de données**
   - Indexer les colonnes fréquemment utilisées
   - Optimiser les requêtes SQL
   - Configurer le cache MySQL

2. **Application**
   - Utiliser le clustering PM2
   - Configurer le cache Redis (optionnel)
   - Optimiser les images

3. **Nginx**
   - Activer la compression gzip
   - Configurer le cache des assets statiques
   - Utiliser HTTP/2