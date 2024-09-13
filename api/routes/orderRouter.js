import { Router } from 'express';
import orderControllers from '../controllers/orderControllers';
import permit from '../utils/permit';

const router = Router();

router.get('/orders/:id?', permit('member'), orderControllers.getUserOrders);
router.get('/all-orders', permit('admin'), orderControllers.getAllOrders);

router.post('/orders/cancel-order', orderControllers.cancelOrder);
router.post('/orders/checkout', orderControllers.checkoutStripeOrder);
router.post('/orders/capture/:orderId', orderControllers.captureOrder);
router.post('/orders/refund', orderControllers.refundOrder);

router.put('/orders/:orderId', orderControllers.updateOrder);

export default router;