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
    automatic_tax: { enabled: true },
  });

  return session;
}

export function constructEvent(body, sig) {
  const webhookSecret = config.STRIPE.WHSEC_TEST;
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecretLocal);
  } catch (err) {
    throw new Error(err.message);
  }

  return event;
};

export async function fulfillOrder(session) {
  const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items'],
  });

  const lineItems = expandedSession.line_items;

  // TODO: Fulfill the order
  // This is where you would:
  // 1. Match the line items to your products
  // 2. Update your database
  // 3. Send confirmation emails
  // 4. Update inventory
  // etc.

  console.log('Order fulfilled!');
  console.log('Line items:', lineItems);
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