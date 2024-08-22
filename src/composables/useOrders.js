import { ref } from 'vue';
import useApi from './useApi';
import useShipping from './useShipping';

const { get, post, put } = useApi();
const { createShipment } = useShipping();

const orderItems = ref([]);

export default function useOrders() {

    async function captureOrderPayment(transactionId, orderId, userid) {
        try {
            const result = await post('orders/capture-order-payment', { transactionId, orderId, userid });
            return result;
        } catch (err) {
            throw err;
        }
    }

    async function createLabel(order) {
        try {
            const { orderItems, shippingAddress } = order;

            const shipment = await createShipment(shippingAddress, orderItems);
            const labelResponse = await post('orders/create-label', { orderItems, shippingAddress });
            return {
                labelResponse,
                shipment
            };
        } catch (err) {
            throw err;
        }
    }

    async function getOrders(apiEndpoint='orders') {
        try {
            const orders = await get(apiEndpoint);
            orderItems.value = orders;
            return orders;
        } catch (err) {
            throw err;
        }
    }

    async function refundOrder(transactionId, amount = null) {
        const refundResult = await post('payments/refund-order', {
            transactionId,
            amount
        });

        return refundResult;
    }

    async function updateOrder(orderId, updates) {
        const updatedOrder = await put(`orders/${orderId}`, updates);

        orderItems.value = orderItems.value.map(orderItem => 
            orderItem._id === orderId 
                ? { ...orderItem, ...updatedOrder } 
                : orderItem
        );
    }


    return  {
        captureOrderPayment,
        createLabel,
        getOrders,
        orderItems,
        refundOrder,
        updateOrder
    }
}