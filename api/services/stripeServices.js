import Stripe from 'stripe';
import config from '../config/environment';
const stripe = new Stripe(config.STRIPE.PRIVATE_TEST);

export async function createCheckoutSession(lineItems) {
  const session = await stripe.checkout.sessions.create({
      customer_email: config.CONTACT.EMAIL,
      line_items: formatLineItems(lineItems),
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      allow_promotion_codes: true,
      success_url: `${config.baseUrl}/cart?success=true`,
      cancel_url: `${config.baseUrl}/cart?canceled=true`,
      automatic_tax: {enabled: true},
  });

  return session;
}

function formatLineItems(lineItems) {
  return lineItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.title.toUpperCase(),
        description: `${item.description}`,
        images: [`${config.baseUrl}${item.coverPhoto}`]
      },
      unit_amount: item.price * 100,
    },
    quantity: item.qty,
    adjustable_quantity: {
      enabled: true,
      maximum: 99,
      minimum: 1
    }
  }));
}
