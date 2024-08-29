import Stripe from 'stripe';
import config from '../config/environment';
const stripe = new Stripe(config.STRIPE.PRIVATE_TEST);

export async function createCheckoutSession(email, lineItems) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: formatLineItems(lineItems),
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    allow_promotion_codes: true,
    success_url: `${config.baseUrl}/api/stripe/fulfill-order`,
    cancel_url: `${config.baseUrl}/cart?canceled=true`,
    automatic_tax: { enabled: true },
    // discounts: [{coupon: 'Ah9S1gRQ'}],
  });

  return session;
}

export async function fulfillOrder(email, sessionId) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items'],
  });

  console.log(JSON.stringify({ session, email }, null, 2));

  return session;

  // TODO: Fulfill the order
  // This is where you would:
  // 1. Match the line items to your products
  // 2. Update your database
  // 3. Send confirmation emails
  // 4. Update inventory
  // etc.

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

// export function constructEvent(body, sig) {
//   const webhookSecret = config.STRIPE.WHSEC_TEST;

//   try {
//     console.log(body);
//     const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
//     return event;
//   } catch (err) {
//     console.error('Error message:', err.message);
//     throw err;
//   }
// }