// import paymentServices from './paymentServices';
import Orders from '../models/orders';
import Users from '../models/users';
import { throwError } from '../utils/errors';
import { extractDateFromId } from '../utils/tools';
import { decrypt, decryptWithKey } from '../utils/encryption';
import { sendEmail } from './contactServices';
import config from '../config/environment';
import orderReceivedTemplate from '../emails/order-received-template';

export async function cancelOrder(orderId, cancellationReason) {
    const orderToCancel = await Orders.findOne(orderId);
    const canCancel = ['PENDING', 'ON_HOLD'].includes(orderToCancel.status);

    if(!canCancel) {
        return {
            success: false,
            message: `Order status must be pending or on hold to cancel`
        }
    }

    const decryptedTransactionId = await getDecryptedTransactionId(orderToCancel);
    const cancelledPayment = orderToCancel.paymentStatus === 'CAPTURED'
        ? await paymentServices.refundPayment(decryptedTransactionId)
        : await paymentServices.voidTransaction(decryptedTransactionId);



    const cancelledOrder = await Orders.update(orderId, {
        status: 'CANCELLED',
        paymentStatus: orderToCancel.paymentStatus === 'CAPTURED' ? 'REFUNDED' : 'VOIDED',
        cancellationReason
    });

    //send email confirmation

    return {
        cancelledOrder,
        cancelledPayment
    }
    
}

export async function captureOrderPayment(paymentTransactionId, orderId, userid) {
    try {
        const decryptedTransactionId = await getDecryptedTransactionId({ paymentTransactionId, userid });
        const paymentResult = await paymentServices.captureTransaction(decryptedTransactionId);
        const { paymentStatus } = await Orders.update(orderId, { paymentStatus: 'CAPTURED' });

        return {
            paymentResult,
            updatedOrder: {
                _id: orderId,
                paymentStatus
            }
        };
    } catch (err) {
        throwError(err);
    }
}

export async function createOrder({ order, user, paymentTransactionId }) {
    const createdOrder = await Orders.save({
        userid: user._id,
        paymentTransactionId,
        contactEmail: order.shippingAddress.email || user.email,
        ...order,
        user
    });

    return createdOrder;
}

export async function createLabel(orderItems, shippingAddress) {
    return { success: true, orderItems, shippingAddress };
}

export async function deleteOrder(orderId) {

}

export async function getOrder(orderId) {

}

export async function getAllOrders() {
    try {
        const userOrders = await Orders.findAll({ userid: '*' });
        
        return sortByMostRecent(userOrders);
    } catch (err) {
        throwError(err);
    }
}

export async function getUserOrders(userid) {
    try {
        const userOrders = await Orders.findAll({ userid });
        const sanitizedOrders = userOrders.map(({ paymentTransactionId, purchasedLabelUrl, ...rest }) => rest);
        
        return sortByMostRecent(sanitizedOrders);
    } catch (err) {
        throwError(err);
    }
}

export async function refundOrder(orderId) {

}

function sortByMostRecent(orders) {
    if(!Array.isArray(orders)) {
        return [];
    }

    return orders.sort((a, b) => {
        const dateA = extractDateFromId(a._id);
        const dateB = extractDateFromId(b._id);

        return dateB.getTime() - dateA.getTime();
    });
}

export async function submitCheckout(order, user) {
    try {
        let savedPaymentMethod;

        if(order.shouldSavePayment) {
            savedPaymentMethod = await paymentServices.savePaymentMethod(order.paymentMethod.nonce, user);
            
            order.paymentMethod = { methodId: savedPaymentMethod.methodId };
        }
    
        const { streetAddress, postalCode } = order.shippingAddress;
        const { id: paymentTransactionId } = await paymentServices.authorizePayment({
            method: order.paymentMethod,
            amount: order.totalPrice,
            streetAddress,
            postalCode,
            deviceData: order.deviceData,
            user
        });
    
        const createdOrder = await createOrder({ order, user, paymentTransactionId });

        const from = `${config.CONTACT.SITENAME} <orders${config.CONTACT.SES_EMAIL}>`;
        const replyTo = `orders${config.CONTACT.SES_EMAIL}`;
        const to = order.shippingAddress.email || user.email;
        const subject = 'Your Order Confirmation';
        const html = orderReceivedTemplate(createdOrder);
        
        await sendEmail({ from, to, replyTo, subject, html });
        sendEmail({ from, to: config.CONTACT.EMAIL, subject, html });
    
        return {
            createdOrder,
            savedPaymentMethod
        };
    } catch (err) {
        throwError(err);
    }
}

export async function updateOrder(orderId, updates) {
    const updatedOrder = await Orders.update(orderId, updates);

    return updatedOrder;
}

export async function getDecryptedTransactionId({ paymentTransactionId, userid }) {
    const { encryptionKey } = await Users.findOne(userid);
    const userEncryption = decrypt(paymentTransactionId);
    
    return decryptWithKey(userEncryption, encryptionKey);
}