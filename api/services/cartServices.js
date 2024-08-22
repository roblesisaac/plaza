import Cart from '../models/cart';
import { throwError } from '../utils/errors';

export default {

    async getCart(user={}) {
        try {
            const userid = user._id;

            if(!userid) {
                return { items: [] };
            }

            return await Cart.findOne({ total: '*', userid });

        } catch (err) {
            throwError(err);
        }
    },

    async saveCart(cart, user={}) {
        try {
            const userid = user._id;

            if(!userid) {
                return { items: [] };
            }
            
            const userCart = await this.getCart(user);

            if(userCart) {
                return await Cart.update(userCart._id, cart);
            }

            return await Cart.save({ ...cart, userid });
        } catch (err) {
            throwError(err);
        }
    }
}