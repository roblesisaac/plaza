import { createCheckoutSession } from '../services/stripeServices';
import { sendError } from '../utils/errors';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const sessionId = await createCheckoutSession();

            res.json(sessionId);
        } catch (err) {
            sendError(res, err);
        }
    }
}