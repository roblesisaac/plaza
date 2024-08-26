import Stripe from 'stripe';
import config from '../config/environment';
const stripe = new Stripe(config.STRIPE.PRIVATE_TEST);

export async function createCheckoutSession(lineItems) {
  console.log(JSON.stringify(lineItems, null, 2));
  
  const session = await stripe.checkout.sessions.create({
      customer_email: config.CONTACT.EMAIL,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'A100',
              description: `For 1” Wood Fences
              “The Original” Garden Hanger is a versatile and functional solution for hanging your favorite plants on a variety of walls or fencing, no tools required.`,
              images: [`${config.baseUrl}/images/a100-1.webp`]
            },
            unit_amount: 2000,
          },
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            maximum: 99,
            minimum: 1
          }
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'A200',
              description: `For 1” Wood Fences
              “The Original” Garden Hanger is a versatile and functional solution for hanging your favorite plants on a variety of walls or fencing, no tools required.`,
              images: [`${config.baseUrl}/images/a100-1.webp`]
            },
            unit_amount: 2000,
          },
          quantity: 2,
        },
      ],
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      allow_promotion_codes: true,
      success_url: `${config.baseUrl}/cart?success=true`,
      cancel_url: `${config.baseUrl}/cart?canceled=true`,
      automatic_tax: {enabled: true},
  });

  return session;
}

function formatLineItems(lineItems=[]) {


  return lineItems.map(lineItem => ({

  }));
}