import stripe from '../controllers/stripeControllers';
import checkIfHuman from '../middlewares/checkIfHuman';

export default (api) => {
    api.post(`/stripe/create-checkout-session`, stripe.createCheckoutSession);
}