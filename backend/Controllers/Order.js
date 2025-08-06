import Order from '../Models/Order.js';
import ResponseHandler from '../Utils/ResponseHandler.js';
import { orderSchema } from '../Utils/ValidationSchemas.js';
import OrderService from '../Services/OrderService.js';
import ApiFeatures from '../Utils/ApiFeatures.js';

class Orders {
    constructor() {
        this.orderService = new OrderService();
    }

    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;
            const customerId = req.query.customer;

            let orders = await Order.findAll();
            let total = orders.length;

            // Appliquer les filtres
            if (status) {
                orders = orders.filter(order => order.statut === status);
            }

            if (customerId) {
                orders = orders.filter(order => order.customer === customerId);
            }

            total = orders.length;

            // Pagination
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedOrders = orders.slice(startIndex, endIndex);

            if (paginatedOrders.length === 0) {
                return ResponseHandler.notFound(res, 'Orders');
            }

            // Enrichir les commandes avec les détails
            const orderService = new OrderService();
            const enrichedOrders = await Promise.all(
                paginatedOrders.map(order => orderService.getOrderDetails(order.orderId))
            );

            return ResponseHandler.paginated(res, enrichedOrders, {
                page,
                limit,
                total
            });
        } catch (error) {
            return ResponseHandler.error(res, 'Error fetching orders', 500, error);
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        try {
            const orderService = new OrderService();
            const order = await orderService.getOrderDetails(id);
            if (!order) {
                return ResponseHandler.notFound(res, 'Order');
            }
            return ResponseHandler.success(res, order, 'Order retrieved successfully');
        } catch (error) {
            return ResponseHandler.error(res, 'Error fetching order', 500, error);
        }
    }

    static async Create(req, res) {
        const { error, value } = orderSchema.validate(req.body);
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return ResponseHandler.validationError(res, errors);
        }

        try {
            const orderService = new OrderService();
            const order = await orderService.createOrder(value);
            return ResponseHandler.success(res, order, 'Order created successfully', 201);
        } catch (error) {
            return ResponseHandler.error(res, error.message, 500, error);
        }
    }

    static async getCustomerOrders(req, res) {
        const { customerId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;

        try {
            const orderService = new OrderService();
            const result = await orderService.getCustomerOrders(customerId, {
                page,
                limit,
                status
            });

            return ResponseHandler.paginated(res, result.orders, result.pagination);
        } catch (error) {
            return ResponseHandler.error(res, 'Error fetching customer orders', 500, error);
        }
    }

    static async cancelOrder(req, res) {
        const { id } = req.params;
        const { reason } = req.body;

        try {
            const orderService = new OrderService();
            const order = await orderService.cancelOrder(id, reason);
            return ResponseHandler.success(res, order, 'Order cancelled successfully');
        } catch (error) {
            return ResponseHandler.error(res, error.message, 400, error);
        }
    }

    static async Update(req, res) {
        const { id } = req.params;
        const data = req.body; // Données à mettre à jour
        try {
            const updatedRows = await Order.Update(id, data);
            if (updatedRows === 0) {
                return ResponseHandler.notFound(res, 'Order');
            }
            
            const orderService = new OrderService();
            const updatedOrder = await orderService.getOrderDetails(id);
            return ResponseHandler.success(res, updatedOrder, 'Order updated successfully');
        } catch (error) {
            return ResponseHandler.error(res, 'Error updating order', 500, error);
        }
    }

    static async Delete(req, res) {
        const { id } = req.params;
        try {
            const deletedRows = await Order.Delete(id);
            if (deletedRows === 0) {
                return ResponseHandler.notFound(res, 'Order');
            }
            return ResponseHandler.success(res, null, 'Order deleted successfully');
        } catch (error) {
            return ResponseHandler.error(res, 'Error deleting order', 500, error);
        }
    }

    static async getTotal(req, res) {
        try {
            const total = await Order.Count();
            return ResponseHandler.success(res, { total }, 'Total orders count retrieved successfully');
        } catch (error) {
            return ResponseHandler.error(res, 'Error counting orders', 500, error);
        }
    }

    static async getStats(req, res) {
        try {
            const { startDate, endDate, customerId } = req.query;
            const orderService = new OrderService();
            const stats = await orderService.getOrderStats({
                startDate,
                endDate,
                customerId
            });
            return ResponseHandler.success(res, stats, 'Order statistics retrieved successfully');
        } catch (error) {
            return ResponseHandler.error(res, 'Error fetching order statistics', 500, error);
        }
    }
}

export default Orders;