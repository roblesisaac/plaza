import { sendError } from '../utils/errors';
import * as stripeService from '../services/stripeServices';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const { lineItems, email } = req.body;
            const { email: userEmail } = req.user || {};
            const session = await stripeService.createCheckoutSession(email || userEmail, lineItems);

            req.session.stripe_session_id = session.id;
            res.json(session.id);
        } catch (err) {
            sendError(res, err);
        }
    },
    fulfillOrder: async (req, res) => {
        try {
            console.log(req.session);
            const { stripe_session_id } = req.session;   
            const { email } = req.user || {};

            await stripeService.fulfillOrder(email, stripe_session_id);

            delete req.session.stripe_session_id;

            res.redirect(`/checkout`);
        } catch (err) {
            sendError(res, err);
        }
    },
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