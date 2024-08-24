import { createCheckoutSession } from '../services/stripeServices';
import { sendError } from '../utils/errors';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const session = await createCheckoutSession();
            res.json(session.id);
        } catch (err) {
            sendError(res, err);
        }
    }
}