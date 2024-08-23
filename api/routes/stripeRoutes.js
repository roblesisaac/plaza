import stripe from '../controllers/stripeControllers';
import checkIfHuman from '../middlewares/checkIfHuman';

export default (api) => {
    api.get(`/stripe/create-checkout-session`, stripe.createCheckoutSession);
}