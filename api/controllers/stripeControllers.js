import { sendError } from '../utils/errors';
import * as stripeService from '../services/stripeServices';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const { lineItems, email } = req.body;
            const { email: userEmail } = req.user || {};
            const session = await stripeService.createCheckoutSession(email || userEmail, lineItems);

            res.json(session.id);
        } catch (err) {
            sendError(res, err);
        }
    },
    saveOrder: async (req, res) => {
        try {
            const { stripe_session_id } = req.query;

            const savedOrder = await stripeService.saveOrder(stripe_session_id, req.user);

            req.session.savedOrder = savedOrder;

            console.log(savedOrder);

            res.redirect(`/checkout`);
        } catch (err) {
            sendError(res, err);
        }
    },
    getSessionOrder: (req, res) => {
        try {
            console.log(req.session);
            res.json(req.session.savedOrder || null);
        } catch (err) {
            sendError(req, err);
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