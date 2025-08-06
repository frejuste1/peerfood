import { Router } from 'express';
import customerRoutes from './Customer.js';
import accountRoutes from './Account.js';
import authenticationRoutes from './Authentication.js';
import checkoutRoutes from './CheckOut.js';
import supplierRoutes from './Supplier.js';
import platRoutes from './Plat.js';
import categoryRoutes from './Category.js';
import orderRoutes from './Order.js';
import paymentRoutes from './Payment.js';


const router = Router();

router.use('/customers', customerRoutes);
router.use('/accounts', accountRoutes);
router.use('/authentication', authenticationRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/plats', platRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);

export default router;