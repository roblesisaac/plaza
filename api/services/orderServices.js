import Orders from '../models/orders';
import { throwError } from '../utils/errors';
import { extractDateFromId } from '../utils/tools';
import { sendEmail } from './contactServices';
import config from '../config/environment';
import orderCreatedTemplate from '../emails/order-created-template';
import orderShippedTemplate from '../emails/order-shipped-template';
import * as StripeService from './stripeServices';

export async function cancelOrder(orderId, cancellationReason) {
    const orderToCancel = await Orders.findOne(orderId);
    const canCancel = orderToCancel.paymentStatus === 'unpaid';

    if(!canCancel) {
        return {
            success: false,
            message: `You can only cancel unpaid orders.`
        }
    }

    const voidedPayment = await StripeService.voidPayment(orderToCancel.stripeSessionId);

    if(voidedPayment.status !== 'canceled') {
        return {
            success: false,
            message: 'Something went wrong. Please try again later.'
        }
    }

    const cancelledOrder = await Orders.update(orderId, {
        status: 'cancelled',
        paymentStatus: 'voided',
        cancellationReason
    });

    // send email

    return cancelledOrder;
}

export async function createStripeOrder(stripeSessionId, orderItems, user) {
    const stripeSession = await StripeService.retreiveStripeSession(stripeSessionId);
    const { id, amount_total, payment_status, shipping_details, customer_email } = stripeSession;

    const { address, name } = shipping_details;
    const savedOrder = await Orders.save({
        userid: user ? user._id : 'guest',
        stripeSessionId: id,
        totalPrice: amount_total,
        orderItems,
        status: 'created',
        paymentStatus: payment_status,
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
        stripeSession: await StripeService.retreiveStripeSession(stripeSessionId)
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

export async function refundOrder(orderId, refundAmount) {
    const savedOrder = await Orders.findOne(orderId);
    const stripeSession = await StripeService.retreiveStripeSession(savedOrder.stripeSessionId);
    const refund = await paymentServices.refundPayment(stripeSession.payment_intent);

    return refund;
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