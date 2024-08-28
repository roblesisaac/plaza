import { sendError } from '../utils/errors';
import * as stripeService from '../services/stripeServices';

export default {
    createCheckoutSession: async (req, res) => {
        try {
            const { lineItems } = req.body;

            const session = await stripeService.createCheckoutSession(lineItems);
            res.json(session.id);
        } catch (err) {
            sendError(res, err);
        }
    },
    fullfillCheckout: async (req, res) => {
        const sig = req.headers['stripe-signature'];

        try {
          const event = stripeService.constructEvent(req.rawBody, sig);

          console.log(event);
      
          switch (event.type) {
            case 'checkout.session.completed':
              await stripeService.fulfillOrder(event.data.object);
              break;
            default:
              console.log(`Unhandled event type ${event.type}`);
          }
      
          res.status(200).send('Webhook received');
        } catch (err) {
          console.error(`Webhook Error: ${err.message}`);
          res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}