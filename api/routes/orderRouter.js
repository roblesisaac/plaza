import { Router } from 'express';
import orderControllers from '../controllers/orderControllers';
import permit from '../utils/permit';

const router = Router();

router.get('/orders/:id?', permit('member'), orderControllers.getUserOrders);
router.get('/all-orders', permit('admin'), orderControllers.getAllOrders);

router.post('/orders/checkout', orderControllers.submitCheckout);
router.post('/orders/capture-order-payment', orderControllers.captureOrderPayment);
router.post('/orders/create-label', orderControllers.createLabel);
router.post('/orders/cancel-order', orderControllers.cancelOrder);

router.put('/orders/:orderId', orderControllers.updateOrder);

export default router;