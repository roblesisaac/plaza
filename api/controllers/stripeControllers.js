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
    retreiveStripePublicKey: (res, res) => {
        try {
            const publicKey = stripeService.retreiveStripePublicKey();
            res.json(publicKey);
        } catch (err) {
            sendError(res, err);
        }
    }
}