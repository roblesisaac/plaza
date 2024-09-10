import Stripe from 'stripe';
import config from '../config/environment';
import isProd from '../utils/isProd';

const stripe = new Stripe(isProd() ? config.STRIPE.PRIVATE : config.STRIPE.PRIVATE_TEST);

export async function capturePayment(stripeSessionId) {
  const session = await retreiveStripeSession(stripeSessionId);
  const paymentIntentId = session.payment_intent;
  
  try {
    const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error capturing payment:', error);
    throw new Error('Failed to capture payment');
  }
}

export async function createCheckoutSession(email, lineItems) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: formatLineItems(lineItems),
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    allow_promotion_codes: true,
    success_url: `${config.baseUrl}/thank-you`,
    cancel_url: `${config.baseUrl}/cart?canceled=true`,
    automatic_tax: { enabled: true },
    payment_intent_data: {
      capture_method: 'manual',
    },
    // discounts: [{coupon: 'Ah9S1gRQ'}],
  });

  return session;
}

export async function refundPayment(stripeSessionId, amount, reason='requested_by_customer') {
  if(!amount) {
    throw new Error('Amount is required');
  }

  const session = await retreiveStripeSession(stripeSessionId);
  const payment_intent = session.payment_intent;

  const refund = await stripe.refunds.create({
    payment_intent,
    amount,
    reason
  });
  
  return refund;
}

export async function voidPayment(stripeSessionId) {
  const session = await retreiveStripeSession(stripeSessionId);
  const paymentIntentId = session.payment_intent;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
  if (paymentIntent.status === 'requires_capture') {
    return await stripe.paymentIntents.cancel(paymentIntentId);
  } else {
    throw new Error('Cannot void payment. The payment is already captured or in a non-voidable state.');
  }
}

export async function retreiveStripeSession(stripeSessionId) {
  return await stripe.checkout.sessions.retrieve(stripeSessionId, {
    expand: ['line_items'],
  });
}

export async function retreiveStripePublicKey() {
  return isProd() ? config.STRIPE.PUBLIC : config.STRIPE.PUBLIC_TEST;
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