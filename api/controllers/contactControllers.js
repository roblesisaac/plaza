import { sendContactEmail, sendEmail } from '../services/contactServices';
import { sendError } from '../utils/errors';

export default {
    sendContactEmail: async (req, res) => {
        try {
            res.json( await sendContactEmail(req.body) );
        } catch (err) {
            sendError(res, err);
        }
    }
}