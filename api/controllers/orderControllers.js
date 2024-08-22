import * as orderServices from '../services/orderServices';
import { sendError } from '../utils/errors';

export default {
    cancelOrder: async (req, res) => {
        try {
            const { orderId, cancellationReason } = req.body;
            const cancelResult = await orderServices.cancelOrder(orderId, cancellationReason);

            res.json(cancelResult);
        } catch (err) {
            sendError(res, err);
        }
    },
    captureOrderPayment: async (req, res) => {
        try {
            const { transactionId, orderId, userid } = req.body;
            const order = await orderServices.captureOrderPayment(transactionId, orderId, userid);

            res.json(order);
        } catch (err) {
            sendError(res, err);
        }
    },
    createLabel: async (req, res) => {
        try {
            const { orderItems, shippingAddress } = req.body;
            const createdLabel = await orderServices.createLabel(orderItems, shippingAddress)

            res.json({ createdLabel });
        } catch (err) {
            sendError(res, err)
        }
    },
    getAllOrders: async (_, res) => {
        try {
            const orders = await orderServices.getAllOrders();

            res.json(orders);
        } catch (err) {
            sendError(res, err);
        }
    },
    getUserOrders: async (req, res) => {
        try {
            const orders = await orderServices.getUserOrders(req.user?._id);

            res.json(orders);
        } catch (err) {
            sendError(res, err);
        }
    },
    submitCheckout: async (req, res) => {
        try {
            const submittedOrder = await orderServices.submitCheckout(req.body, req.user);

            res.json(submittedOrder);
        } catch (err) {
            sendError(res, err);
        }
    },
    updateOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            const updatedOrder = await orderServices.updateOrder(orderId, req.body);

            res.json(updatedOrder);
        } catch (err) {
            sendError(res, err);
        }
    }
}