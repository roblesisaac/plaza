import PaymentService from '../services/paymentServices';
import { sendError } from '../utils/errors';

export default {
    async authorizePayment(req, res) {
        try {
            const { deviceData, method, amount, streetAddress, zipCode } = req.body;
            const { email, brainId } = req.user;

            const result = await PaymentService.authorizePayment({
                method,
                amount,
                streetAddress,
                zipCode,
                deviceData,
                user: { brainId, email }
            });

            res.json(result);
        } catch (err) {
            sendError(res, err);
        }
    },
    async captureTransaction(req, res) {
        try {
            const { transactionId } = req.body;
            const result = await PaymentService.captureTransaction(transactionId);

            res.json(result);
        } catch (err) {
            sendError(res, err);
        }
    },
    async clientToken(req, res) {
        try {
            const { userId } = req.params;
            res.json(await PaymentService.generateClientToken(userId));
        } catch (err) {
            sendError(res, err);
        }
    },
    async deletePaymentMethod(req, res) {
        try {
            const { methodId } = req.params;
            const result = await PaymentService.deletePaymentMethod(methodId);
            res.json(result);
        } catch (err) {
            sendError(res, err);
        }
    },
    async getPaymentMethods(req, res) {
        try {
            const savedPaymentMethods = await PaymentService.getCustomerPaymentMethods(req.user);
            res.json(savedPaymentMethods);
        } catch (err) {
            sendError(res, err);
        }
    },
    async refundOrder(req, res) {
        try {
            const { transactionId, amount } = req.body;

            const result = await PaymentService.refundPayment(transactionId, amount);

            res.json(result);
        } catch (err) {
            sendError(res, err);
        }
    },
    async savePaymentMethod(req, res) {
        try {
            const result = await PaymentService.savePaymentMethod(req.body.nonce, req.user);

            res.json(result);
        } catch (err) {
            sendError(res, err);
        }
    },
    async makeDefaultPaymentMethod(req, res) {
        try {
            const result = await PaymentService.makeDefaultPaymentMethod(req.body.methodId, req.user);
            res.json(result);
        } catch (err) {
            sendError(res, err);
        }
    }
}