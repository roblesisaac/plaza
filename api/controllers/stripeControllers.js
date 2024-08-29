import { sendError } from '../utils/errors';
import * as stripeService from '../services/stripeServices';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const { lineItems } = req.body;
            const { email } = req.user || {};

            const session = await stripeService.createCheckoutSession(email, lineItems);

            req.session.stripe_session_id = session.id;
            res.json(session.id);
        } catch (err) {
            sendError(res, err);
        }
    },
    completeOrder: async (req, res) => {
        try {
            const { sessionId } = req.params;
            const { email } = req.user || {};

            const session = await stripeService.completeOrder(email, sessionId);

            res.redirect(`/checkout?session_id=${session.id}`);
        } catch (err) {
            sendError(res, err);
        }
    },
    getSession: async (req, res) => {
        try {
            const session = await stripeService.getSession(req.session.stripe_session_id);
            res.json(session);
        } catch (err) {
            sendError(res, err);
        }
    },
    fullfillCheckout: async (req, res) => {
        const sig = req.headers['stripe-signature'];

        try {
            
            const event = stripeService.constructEvent(req.rawBody, sig);
            res.status(200).send('Webhook received');
      
            switch (event.type) {
                case 'checkout.session.completed':
                    await stripeService.fulfillOrder(event.data.object);
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}