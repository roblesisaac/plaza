import cart from '../services/cartServices';
import { sendError } from '../utils/errors';

export default {
    
    async getCart(req, res) {
        try {
            res.json( await cart.getCart(req.user) );
        } catch(err) {
            sendError(res, err);
        }
    },
    
    async saveCart({ body, user }, res) {
        try {
            res.json( await cart.saveCart(body, user) );
        } catch (err) {
            sendError(res, err);
        }
    }
    
}