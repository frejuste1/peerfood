import Order from '../Models/Order.js';
import Customer from '../Models/Customer.js';
import Plat from '../Models/Plat.js';
import Category from '../Models/Category.js';
import PaymentService from './PaymentService.js';
import logger from '../Utils/Logger.js';

class OrderService {
    constructor() {
        this.paymentService = new PaymentService();
    }

    /**
     * Créer une nouvelle commande avec validation complète
     * @param {Object} orderData - Données de la commande
     * @returns {Promise<Object>} Commande créée
     */
    async createOrder(orderData) {
        try {
            // Validation des données
            await this.validateOrderData(orderData);

            // Générer un ID de commande unique
            const orderCount = await Order.Count();
            const orderId = `ORD${(orderCount + 1).toString().padStart(4, '0')}`;

            // Calculer les dates
            const orderDate = new Date();
            const paymentDeadline = new Date(orderDate.getTime() + (24 * 60 * 60 * 1000)); // 24h
            const deliveryDate = new Date(orderDate.getTime() + (48 * 60 * 60 * 1000)); // 48h

            const order = {
                orderId,
                ...orderData,
                orderDate: orderDate.toISOString().split('T')[0],
                orderTime: orderDate.toTimeString().split(' ')[0],
                paymentDeadline,
                deliveryDate,
                statut: 'Unpaid'
            };

            const createdOrderId = await Order.Create(order);

            // Initier le paiement si une méthode est spécifiée
            if (orderData.payMethod && orderData.paymentPhone) {
                try {
                    const paymentResult = await this.paymentService.initiatePayment({
                        method: orderData.payMethod,
                        amount: orderData.price,
                        phone: orderData.paymentPhone,
                        orderId
                    });

                    logger.info(`Paiement initié pour la commande ${orderId}:`, paymentResult);
                } catch (paymentError) {
                    logger.error('Erreur lors de l\'initiation du paiement:', paymentError);
                    // La commande est créée même si le paiement échoue
                }
            }

            return await this.getOrderDetails(orderId);
        } catch (error) {
            logger.error('Erreur lors de la création de la commande:', error);
            throw error;
        }
    }

    /**
     * Valider les données de commande
     * @param {Object} orderData - Données à valider
     */
    async validateOrderData(orderData) {
        // Vérifier que le client existe
        const customer = await Customer.findById(orderData.customer);
        if (!customer) {
            throw new Error('Client non trouvé');
        }

        // Vérifier que le plat existe et est disponible
        const plat = await Plat.findById(orderData.plat);
        if (!plat) {
            throw new Error('Plat non trouvé');
        }
        if (!plat.availability) {
            throw new Error('Plat non disponible');
        }

        // Vérifier que la catégorie existe
        const category = await Category.findById(orderData.category);
        if (!category) {
            throw new Error('Catégorie non trouvée');
        }

        // Vérifier que le prix correspond
        if (parseFloat(orderData.price) !== parseFloat(plat.price)) {
            throw new Error('Prix incorrect');
        }
    }

    /**
     * Obtenir les détails complets d'une commande
     * @param {string} orderId - ID de la commande
     * @returns {Promise<Object>} Détails de la commande
     */
    async getOrderDetails(orderId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error('Commande non trouvée');
            }

            // Enrichir avec les détails du client, plat, etc.
            const customer = await Customer.findById(order.customer);
            const plat = await Plat.findById(order.plat);
            const category = await Category.findById(order.category);

            return {
                ...order,
                customerDetails: customer,
                platDetails: plat,
                categoryDetails: category
            };
        } catch (error) {
            logger.error('Erreur lors de la récupération des détails:', error);
            throw error;
        }
    }

    /**
     * Obtenir les commandes d'un client avec pagination
     * @param {string} customerId - ID du client
     * @param {Object} options - Options de pagination et filtrage
     * @returns {Promise<Object>} Commandes paginées
     */
    async getCustomerOrders(customerId, options = {}) {
        try {
            const { page = 1, limit = 10, status } = options;
            
            // Ici vous pourriez implémenter une méthode findByCustomer dans le modèle Order
            // Pour l'instant, on utilise findAll et on filtre
            const allOrders = await Order.findAll();
            let customerOrders = allOrders.filter(order => order.customer === customerId);

            if (status) {
                customerOrders = customerOrders.filter(order => order.statut === status);
            }

            // Pagination manuelle
            const total = customerOrders.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedOrders = customerOrders.slice(startIndex, endIndex);

            // Enrichir chaque commande avec les détails
            const enrichedOrders = await Promise.all(
                paginatedOrders.map(order => this.getOrderDetails(order.orderId))
            );

            return {
                orders: enrichedOrders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error('Erreur lors de la récupération des commandes client:', error);
            throw error;
        }
    }

    /**
     * Annuler une commande
     * @param {string} orderId - ID de la commande
     * @param {string} reason - Raison de l'annulation
     * @returns {Promise<Object>} Commande mise à jour
     */
    async cancelOrder(orderId, reason = 'Cancelled by user') {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error('Commande non trouvée');
            }

            if (order.statut === 'Paid') {
                throw new Error('Impossible d\'annuler une commande déjà payée');
            }

            if (order.statut === 'Cancelled') {
                throw new Error('Commande déjà annulée');
            }

            await Order.Update(orderId, { 
                statut: 'Cancelled',
                cancelReason: reason,
                cancelDate: new Date()
            });

            logger.info(`Commande ${orderId} annulée: ${reason}`);
            return await this.getOrderDetails(orderId);
        } catch (error) {
            logger.error('Erreur lors de l\'annulation:', error);
            throw error;
        }
    }

    /**
     * Obtenir les statistiques des commandes
     * @param {Object} filters - Filtres pour les statistiques
     * @returns {Promise<Object>} Statistiques des commandes
     */
    async getOrderStats(filters = {}) {
        try {
            const { startDate, endDate, customerId } = filters;
            
            // Implémentation basique - à améliorer avec des requêtes SQL optimisées
            const allOrders = await Order.findAll();
            let filteredOrders = allOrders;

            if (customerId) {
                filteredOrders = filteredOrders.filter(order => order.customer === customerId);
            }

            if (startDate) {
                filteredOrders = filteredOrders.filter(order => 
                    new Date(order.orderDate) >= new Date(startDate)
                );
            }

            if (endDate) {
                filteredOrders = filteredOrders.filter(order => 
                    new Date(order.orderDate) <= new Date(endDate)
                );
            }

            const stats = {
                totalOrders: filteredOrders.length,
                paidOrders: filteredOrders.filter(o => o.statut === 'Paid').length,
                unpaidOrders: filteredOrders.filter(o => o.statut === 'Unpaid').length,
                cancelledOrders: filteredOrders.filter(o => o.statut === 'Cancelled').length,
                totalRevenue: filteredOrders
                    .filter(o => o.statut === 'Paid')
                    .reduce((sum, o) => sum + parseFloat(o.price), 0),
                averageOrderValue: 0
            };

            stats.averageOrderValue = stats.paidOrders > 0 
                ? stats.totalRevenue / stats.paidOrders 
                : 0;

            return stats;
        } catch (error) {
            logger.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    }
}

export default OrderService;