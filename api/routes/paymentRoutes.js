import paymentControllers from '../controllers/paymentControllers';
import permit from '../utils/permit';

export default function(api) {
    api.get('/payments/client-token/:userId?', paymentControllers.clientToken);
    api.get('/payments/get-methods', permit('member'), paymentControllers.getPaymentMethods);

    api.post('/payments/capture-transaction', permit('admin'), paymentControllers.captureTransaction);
    api.post('/payments/checkout', permit('member'), paymentControllers.authorizePayment);
    api.post('/payments/save-method', permit('member'), paymentControllers.savePaymentMethod);
    api.post('/payments/refund-order', permit('admin'), paymentControllers.refundOrder);
    api.put('/payments/make-default', permit('member'), paymentControllers.makeDefaultPaymentMethod);

    api.delete('/payments/:methodId', permit('member'), paymentControllers.deletePaymentMethod);
}