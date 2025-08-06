# Documentation API PeerFood

## Vue d'ensemble

L'API PeerFood est une API RESTful qui permet de gérer un système de cantine scolaire avec paiement mobile intégré.

**URL de base:** `http://localhost:8086`

## Authentification

L'API utilise l'authentification JWT avec des cookies HTTP-only pour la sécurité.

### Endpoints d'authentification

#### POST /auth/login
Connecter un utilisateur.

**Corps de la requête:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Réponse de succès (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "username": "john_doe",
      "role": "Student"
    }
  }
}
```

#### POST /auth/register
Créer un nouveau compte utilisateur.

**Corps de la requête:**
```json
{
  "customerId": "CLD0001",
  "username": "john_doe",
  "password": "SecurePass123!",
  "role": "Student"
}
```

#### GET /auth/me
Obtenir les informations de l'utilisateur connecté.

**Headers requis:**
- Cookie avec token JWT ou Authorization: Bearer {token}

#### POST /auth/logout
Déconnecter l'utilisateur.

## Gestion des clients

### GET /customer
Récupérer tous les clients avec pagination.

**Paramètres de requête:**
- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 10)
- `status` (optionnel): Filtrer par statut (Enabled/Disabled)
- `search` (optionnel): Recherche textuelle

**Réponse:**
```json
{
  "success": true,
  "message": "Customers retrieved successfully",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### POST /customer/add
Créer un nouveau client.

**Corps de la requête:**
```json
{
  "lastname": "Dupont",
  "firstname": "Jean",
  "phone": "0123456789",
  "email": "jean.dupont@example.com"
}
```

### GET /customer/findById/:id
Récupérer un client par son ID.

### PUT /customer/update/:id
Mettre à jour un client.

### DELETE /customer/delete/:id
Supprimer un client.

## Gestion des plats

### GET /meal
Récupérer tous les plats.

**Paramètres de requête:**
- `category` (optionnel): Filtrer par catégorie
- `search` (optionnel): Recherche textuelle
- `available` (optionnel): Filtrer par disponibilité

### POST /meal
Créer un nouveau plat.

**Corps de la requête:**
```json
{
  "platName": "Riz au gras",
  "description": "Délicieux riz préparé avec des légumes frais",
  "price": 2500,
  "imagePath": "https://example.com/image.jpg",
  "availability": true
}
```

### GET /meal/:id
Récupérer un plat par son ID.

### PUT /meal/:id
Mettre à jour un plat.

### DELETE /meal/:id
Supprimer un plat.

## Gestion des commandes

### GET /order
Récupérer toutes les commandes (Admin seulement).

**Paramètres de requête:**
- `page`, `limit`: Pagination
- `status`: Filtrer par statut (Unpaid/Paid/Cancelled)
- `customer`: Filtrer par client

### POST /order
Créer une nouvelle commande.

**Corps de la requête:**
```json
{
  "plat": 1,
  "customer": "CLD0001",
  "category": 1,
  "price": 2500,
  "paymentPhone": "0123456789",
  "payMethod": "Wave",
  "deliveryDate": "2024-01-15"
}
```

### GET /order/customer/:customerId
Récupérer les commandes d'un client spécifique.

### PATCH /order/:id/cancel
Annuler une commande.

**Corps de la requête:**
```json
{
  "reason": "Changement d'avis"
}
```

### GET /order/stats
Obtenir les statistiques des commandes.

**Paramètres de requête:**
- `startDate`, `endDate`: Période
- `customerId`: Statistiques pour un client spécifique

## Gestion des paiements

### POST /payment
Initier un paiement.

**Corps de la requête:**
```json
{
  "orderId": "ORD0001",
  "method": "Wave",
  "amount": 2500
}
```

### GET /payment/:id/status
Vérifier le statut d'un paiement.

### POST /payment/webhook/:provider
Webhook pour les notifications de paiement.

## Codes d'erreur

- **200**: Succès
- **201**: Créé avec succès
- **400**: Erreur de validation
- **401**: Non authentifié
- **403**: Accès interdit
- **404**: Ressource non trouvée
- **409**: Conflit (ressource déjà existante)
- **422**: Erreur de validation des données
- **500**: Erreur serveur

## Format des réponses

Toutes les réponses suivent ce format standard:

```json
{
  "success": boolean,
  "message": "string",
  "data": object|array|null,
  "pagination": object, // Pour les listes paginées
  "errors": array, // Pour les erreurs de validation
  "timestamp": "ISO_string"
}
```

## Authentification et autorisation

### Rôles disponibles:
- **Student**: Étudiant (peut passer des commandes)
- **Teacher**: Enseignant (peut passer des commandes)
- **administrator**: Administrateur (accès complet)

### Permissions par rôle:

| Endpoint | Student | Teacher | Administrator |
|----------|---------|---------|---------------|
| GET /customer | ❌ | ❌ | ✅ |
| POST /customer/add | ❌ | ❌ | ✅ |
| GET /meal | ✅ | ✅ | ✅ |
| POST /order | ✅ | ✅ | ✅ |
| GET /order | ❌ | ❌ | ✅ |
| PATCH /order/:id/cancel | ✅* | ✅* | ✅ |

*Seulement leurs propres commandes

## Exemples d'utilisation

### Créer un compte et passer une commande

1. **Créer un client:**
```bash
curl -X POST http://localhost:8086/customer/add \
  -H "Content-Type: application/json" \
  -d '{
    "lastname": "Dupont",
    "firstname": "Jean",
    "phone": "0123456789",
    "email": "jean.dupont@example.com"
  }'
```

2. **Créer un compte utilisateur:**
```bash
curl -X POST http://localhost:8086/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "CLD0001",
    "username": "jean_dupont",
    "password": "SecurePass123!",
    "role": "Student"
  }'
```

3. **Se connecter:**
```bash
curl -X POST http://localhost:8086/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jean_dupont",
    "password": "SecurePass123!"
  }'
```

4. **Passer une commande:**
```bash
curl -X POST http://localhost:8086/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "plat": 1,
    "customer": "CLD0001",
    "category": 1,
    "price": 2500,
    "paymentPhone": "0123456789",
    "payMethod": "Wave"
  }'
```

## Intégration des paiements mobiles

### Wave
L'intégration Wave permet de créer des sessions de paiement sécurisées.

### MTN Mobile Money
Support complet de l'API MTN MoMo pour les paiements.

### Orange Money
Intégration avec l'API Orange Money pour les transactions.

## Webhooks

Les webhooks permettent de recevoir des notifications en temps réel sur l'état des paiements.

### Configuration des webhooks:
- **MTN MoMo**: `POST /payment/webhook/mtn`
- **Orange Money**: `POST /payment/webhook/orange`
- **Wave**: `POST /payment/webhook/wave`

## Limitations et quotas

- **Taux limite**: 100 requêtes par 15 minutes par IP
- **Taille maximale des uploads**: 5MB
- **Timeout des requêtes**: 30 secondes

## Support et contact

Pour toute question ou problème:
- **Email**: keifrejuste26@gmail.com
- **WhatsApp**: +225 05 46 93 05 47
- **Issues GitHub**: https://github.com/Frejuste26/peerfood/issues