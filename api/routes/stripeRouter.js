import express, { Router } from 'express';
import stripeControllers from '../controllers/stripeControllers';

const router = Router();

router.get('/session-order', stripeControllers.getSessionOrder);

router.get('/save-order', stripeControllers.saveOrder);

router.post(
    `/create-checkout-session`,
    express.json(),
    stripeControllers.createCheckoutSession
);

// router.post(
//     '/fulfill-checkout-webhook',
//     express.raw({type: 'application/json'}),
//     stripeControllers.fullfillCheckoutWebook
// );

export default router;