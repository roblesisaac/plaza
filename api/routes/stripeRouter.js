import express, { Router } from 'express';
import stripeControllers from '../controllers/stripeControllers';

const router = Router();

router.get('/test', (req, res) => res.json('hi...'));

router.get('/fulfill-order', stripeControllers.fulfillOrder);

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