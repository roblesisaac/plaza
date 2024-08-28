import express, { Router } from 'express';
import stripeControllers from '../controllers/stripeControllers';

const router = Router();

router.get('/stripe/hi', (req, res) => res.json('hi stripe!!'));

router.post(
    `/stripe/create-checkout-session`,
    express.json(),
    stripeControllers.createCheckoutSession
);

router.post(
    '/stripe/fulfill-checkout',
    express.raw({type: 'application/json'}),
    stripeControllers.fullfillCheckout
);

export default router;