// import paymentServices from './paymentServices';
import Orders from '../models/orders';
import Users from '../models/users';
import { throwError } from '../utils/errors';
import { extractDateFromId } from '../utils/tools';
import { decrypt, decryptWithKey } from '../utils/encryption';
import { sendEmail } from './contactServices';
import config from '../config/environment';
import orderCreatedTemplate from '../emails/order-created-template';
import orderShippedTemplate from '../emails/order-shipped-template';
import { retreiveStripeSession } from './stripeServices';

export async function cancelOrder(orderId, cancellationReason) {
    const orderToCancel = await Orders.findOne(orderId);
    const canCancel = ['created', 'on_hold'].includes(orderToCancel.status);

    if(!canCancel) {
        return {
            success: false,
            message: `Order status must be created or on hold to cancel`
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

    // send email

    return {
        cancelledOrder,
        cancelledPayment
    }
    
}

export async function createStripeOrder(stripeSessionId, user) {
    const stripeSession = await retreiveStripeSession(stripeSessionId);
    const { id, amount_total, payment_status, payment_intent, shipping_details, customer_email } = stripeSession;

    const { address, name } = shipping_details;
    const savedOrder = await Orders.save({
        userid: user ? user._id : 'guest',
        stripeSessionId: id,
        totalPrice: amount_total,
        status: 'created',
        paymentStatus: payment_status,
        paymentIntent: payment_intent,
        shippingAddress: {
            customerName: name,
            email: customer_email,
            street: address.line1,
            city: address.city,
            state: address.state,
            zipCode: address.postal_code
        }
    });
  
    return {
      ...savedOrder,
      stripeSession: stripeSession
    };
}

export async function getStripeOrderSession(order) {
    const { stripeSessionId, ...restOrder } = order;

    return {
        ...restOrder,
        stripeSession: await retreiveStripeSession(stripeSessionId)
    }
}

export async function getAllOrders() {
    try {
        const userOrders = await Orders.findAll({ userid: '*' });
        const userOrdersWithStripeSessions = [];

        for (const userOrder of userOrders) {
            const stripedOrder = await getStripeOrderSession(userOrder); 

            userOrdersWithStripeSessions.push(stripedOrder);
        }
        
        return sortByMostRecent(userOrdersWithStripeSessions);
    } catch (err) {
        throwError(err);
    }
}

export async function getUserOrders(userid) {
    try {
        const userOrders = await Orders.findAll({ userid });
        const sanitizedOrders = [];

        for (const userOrder of userOrders) {
            const { purchasedLabelUrl, ...sanitizedOrder } = await getStripeOrderSession(userOrder); 

            sanitizedOrders.push(sanitizedOrder);
        }
        
        return sortByMostRecent(sanitizedOrders);
    } catch (err) {
        throwError(err);
    }
}

export async function refundOrder(orderId) {

}

export async function sendOrderStatusEmail(order) {
    const emailTemplates = {
        'created': {
            subject: 'Your Order Confirmation',
            template: orderCreatedTemplate
        },
        'on_hold': 'order-on-hold-template',
        'shipped': {
            subject: '',
            template: orderShippedTemplate
        },
        'delivered': 'order-delivered-template',
        'cancelled': 'order-cancelled-template'
    };

    const from = `${config.CONTACT.SITENAME} <orders${config.CONTACT.SES_EMAIL}>`;
    const replyTo = `orders${config.CONTACT.SES_EMAIL}`;
    const toCustomer = order.shippingAddress.email;
    const toAdmin = config.CONTACT.EMAIL;
    const { subject, template } = emailTemplates[order.status];

    if(!template) {
        return;
    }

    const html = template(order);

    try {
        await Promise.all([
            sendEmail({ from, to: toCustomer, replyTo, subject, html }),
            sendEmail({ from, to: toAdmin, subject, html })
        ]);
    } catch (error) {
        console.error("Error sending email:", error);
    }
    
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

export async function updateOrder(orderId, updates) {
    const updatedOrder = await Orders.update(orderId, updates);

    return updatedOrder;
}

export async function getDecryptedTransactionId({ paymentTransactionId, userid }) {
    const { encryptionKey } = await Users.findOne(userid);
    const userEncryption = decrypt(paymentTransactionId);
    
    return decryptWithKey(userEncryption, encryptionKey);
}