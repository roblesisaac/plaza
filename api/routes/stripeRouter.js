import express, { Router } from 'express';
import stripeControllers from '../controllers/stripeControllers';

const router = Router();

router.post(
    `/create-checkout-session`,
    express.json(),
    stripeControllers.createCheckoutSession
);

router.get('/public-key', express.json(), stripeControllers.retreiveStripePublicKey);

// router.post(
//     '/fulfill-checkout-webhook',
//     express.raw({type: 'application/json'}),
//     stripeControllers.fullfillCheckoutWebook
// );

export default router;