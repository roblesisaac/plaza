import Stripe from 'stripe';
import config from '../config/environment';
const stripe = new Stripe(config.STRIPE.PRIVATE);

export async function createCheckoutSession() {
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
                descsription: 'Comfortable cotton t-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${config.URL}/success`,
        cancel_url: `${config.URL}/cancel`,
        automatic_tax: {enabled: true},
    });

    return session.url;
}