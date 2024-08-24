import Stripe from 'stripe';
import config from '../config/environment';
const stripe = new Stripe(config.STRIPE.PRIVATE_TEST);

export async function createCheckoutSession() {
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
                description: 'Comfortable cotton t-shirt',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${config.baseUrl}/cart?success=true`,
        cancel_url: `${config.baseUrl}/cart?canceled=true`,
        automatic_tax: {enabled: true},
    });

    return session;
}