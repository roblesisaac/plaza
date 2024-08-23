import { createCheckoutSession } from '../services/stripeServices';
import { sendError } from '../utils/errors';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const sessionUrl = await createCheckoutSession();

            res.redirect(sessionUrl);
        } catch (err) {
            sendError(res, err);
        }
    }
}