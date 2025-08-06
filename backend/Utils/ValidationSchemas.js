import Joi from 'joi';

export const customerSchema = Joi.object({
    customerId: Joi.string().pattern(/^CLD\d{4}$/).optional(),
    lastname: Joi.string().min(2).max(30).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).required(),
    firstname: Joi.string().min(2).max(50).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).required(),
    phone: Joi.string().pattern(/^(?:(?:\+|00)225|0)[0-9]{8,10}$/).required(),
    email: Joi.string().email().required()
});

export const accountSchema = Joi.object({
    customer: Joi.string().pattern(/^CLD\d{4}$/).required(),
    username: Joi.string().min(3).max(20).pattern(/^[a-zA-Z0-9_]+$/).required(),
    mdpasse: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required(),
    role: Joi.string().valid('Student', 'Teacher').default('Student'),
    statut: Joi.string().valid('Enabled', 'Disabled').default('Enabled')
});

export const platSchema = Joi.object({
    platName: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(10).max(500).required(),
    price: Joi.number().positive().precision(2).required(),
    imagePath: Joi.string().uri().required(),
    availability: Joi.boolean().default(true)
});

export const categorySchema = Joi.object({
    categoryName: Joi.string().min(2).max(50).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).required()
});

export const supplierSchema = Joi.object({
    supplierId: Joi.string().pattern(/^SUP\d{4}$/).optional(),
    supplierName: Joi.string().min(2).max(50).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).required(),
    phone: Joi.string().pattern(/^(?:(?:\+|00)225|0)[0-9]{8,10}$/).required(),
    address: Joi.string().min(5).max(255).required()
});

export const orderSchema = Joi.object({
    orderId: Joi.string().pattern(/^ORD\d{4}$/).optional(),
    plat: Joi.number().integer().positive().required(),
    customer: Joi.string().pattern(/^CLD\d{4}$/).required(),
    category: Joi.number().integer().positive().required(),
    orderDate: Joi.date().required(),
    orderTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    price: Joi.number().positive().precision(2).required(),
    paymentPhone: Joi.string().pattern(/^(?:(?:\+|00)225|0)[0-9]{8,10}$/).optional(),
    statut: Joi.string().valid('Unpaid', 'Paid', 'Cancelled').default('Unpaid'),
    paymentDeadline: Joi.date().greater('now').required(),
    deliveryDate: Joi.date().greater('now').required(),
    payMethod: Joi.string().valid('MTN MoMo', 'Orange Money', 'Wave').optional()
});

export const paymentSchema = Joi.object({
    payCode: Joi.string().pattern(/^PAY\d{4}$/).optional(),
    orderId: Joi.string().pattern(/^ORD\d{4}$/).required(),
    method: Joi.string().valid('MTN MoMo', 'Orange Money', 'Wave').required(),
    amount: Joi.number().positive().precision(2).required(),
    transactionNumber: Joi.string().max(100).optional(),
    paymentDate: Joi.date().optional(),
    statut: Joi.string().valid('Waiting', 'Completed', 'Failed').default('Waiting')
});

export const loginSchema = Joi.object({
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(6).required()
});

export const updateProfileSchema = Joi.object({
    lastname: Joi.string().min(2).max(30).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).optional(),
    firstname: Joi.string().min(2).max(50).pattern(/^[a-zA-ZÀ-ÿ\s]+$/).optional(),
    phone: Joi.string().pattern(/^(?:(?:\+|00)225|0)[0-9]{8,10}$/).optional(),
    email: Joi.string().email().optional(),
    username: Joi.string().min(3).max(20).pattern(/^[a-zA-Z0-9_]+$/).optional()
});