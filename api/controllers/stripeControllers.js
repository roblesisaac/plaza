import { sendError } from '../utils/errors';
import * as stripeService from '../services/stripeServices';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const { lineItems, email } = req.body;
            const { email: userEmail } = req.user || {};
            const stripeSession = await stripeService.createCheckoutSession(email || userEmail, lineItems);

            const tempSessionStore = req.isAuthenticated() ? req.session.passport : req.session;

            tempSessionStore.stripe_session_id = stripeSession.id;

            res.json(stripeSession.id);
        } catch (err) {
            sendError(res, err);
        }
    },
    saveOrder: async (req, res) => {
        try {
            const tempSessionStore = req.isAuthenticated() ? req.session.passport : req.session;
            const { stripe_session_id } = tempSessionStore;

            if(!stripe_session_id) {
                return res.json(tempSessionStore.savedStripeOrder);
            }

            const savedStripeOrder = await stripeService.saveOrder(stripe_session_id, req.user);

            tempSessionStore.savedStripeOrder = savedStripeOrder;
            delete tempSessionStore.stripe_session_id;

            res.json(savedStripeOrder);
        } catch (err) {
            sendError(res, err);
        }
    }
    // fullfillCheckoutWebhook: async (req, res) => {
    //     const sig = req.headers['stripe-signature'];

    //     try {
            
    //         const event = stripeService.constructEvent(req.rawBody, sig);
    //         res.status(200).send('Webhook received');
      
    //         switch (event.type) {
    //             case 'checkout.session.completed':
    //                 await stripeService.fulfillOrder(event.data.object);
    //                 break;
    //             default:
    //                 console.log(`Unhandled event type ${event.type}`);
    //         }
    //     } catch (err) {
    //         console.error(`Webhook Error: ${err.message}`);
    //         res.status(400).send(`Webhook Error: ${err.message}`);
    //     }
    // }
}