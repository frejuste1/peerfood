import { Router } from 'express';
import Orders from "../Controllers/Order.js";
import AuthMiddleware from "../Middlewares/AuthMiddleware.js";
import Security from "../Middlewares/RoleMiddleware.js";
import ValidationMiddleware from "../Middlewares/ValidationMiddleware.js";
import { orderSchema } from "../Utils/ValidationSchemas.js";
import Joi from 'joi';

const Order = Router();

// Schémas de validation pour les paramètres
const orderIdSchema = Joi.object({
    id: Joi.string().pattern(/^ORD\d{4}$/).required()
});

const customerIdSchema = Joi.object({
    customerId: Joi.string().pattern(/^CLD\d{4}$/).required()
});

Order
    // Obtenir toutes les commandes (Admin seulement)
    .get(
        '/',
        AuthMiddleware.handle,
        Security.Restricted('administrator'),
        Orders.getAll
    )
    
    // Obtenir les statistiques des commandes (Admin seulement)
    .get(
        '/stats',
        AuthMiddleware.handle,
        Security.Restricted('administrator'),
        Orders.getStats
    )
    
    // Obtenir les commandes d'un client spécifique
    .get(
        '/customer/:customerId',
        AuthMiddleware.handle,
        ValidationMiddleware.validateParams(customerIdSchema),
        Security.Restricted('administrator', 'Student', 'Teacher'),
        Orders.getCustomerOrders
    )
    
    // Obtenir une commande par ID
    .get(
        '/:id',
        AuthMiddleware.handle,
        ValidationMiddleware.validateParams(orderIdSchema),
        Security.Restricted('administrator'),
        Orders.getById
    )
    
    // Obtenir le total des commandes
    .get(
        '/total',
        AuthMiddleware.handle,
        Security.Restricted('administrator'),
        Orders.getTotal
    )
    
    // Créer une nouvelle commande
    .post(
        '/',
        AuthMiddleware.handle,
        ValidationMiddleware.validate(orderSchema),
        Security.Restricted('administrator', 'Student', 'Teacher'),
        Orders.Create
    )
    
    // Mettre à jour une commande
    .put(
        '/:id',
        AuthMiddleware.handle,
        ValidationMiddleware.validateParams(orderIdSchema),
        Security.Restricted('administrator'),
        Orders.Update
    )
    
    // Annuler une commande
    .patch(
        '/:id/cancel',
        AuthMiddleware.handle,
        ValidationMiddleware.validateParams(orderIdSchema),
        Security.Restricted('administrator', 'Student', 'Teacher'),
        Orders.cancelOrder
    )
    
    // Supprimer une commande
    .delete(
        '/:id',
        AuthMiddleware.handle,
        ValidationMiddleware.validateParams(orderIdSchema),
        Security.Restricted('administrator'),
        Orders.Delete
    );

export default Order;