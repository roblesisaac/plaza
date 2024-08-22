import orderControllers from '../controllers/orderControllers';
import permit from '../utils/permit';

export default function(api) {
    api.get('/orders/:id?', permit('member'), orderControllers.getUserOrders);
    api.get('/all-orders', permit('admin'), orderControllers.getAllOrders);

    api.post('/orders/checkout', orderControllers.submitCheckout);
    api.post('/orders/capture-order-payment', orderControllers.captureOrderPayment);
    api.post('/orders/create-label', orderControllers.createLabel);
    api.post('/orders/cancel-order', orderControllers.cancelOrder);
    
    api.put('/orders/:orderId', orderControllers.updateOrder);
}