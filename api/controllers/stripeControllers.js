import { createCheckoutSession } from '../services/stripeServices';
import { sendError } from '../utils/errors';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const { lineItems } = req.body;

            const session = await createCheckoutSession(lineItems);
            res.json(session.id);
        } catch (err) {
            sendError(res, err);
        }
    }
}