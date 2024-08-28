import express, { Router } from 'express';
import stripeControllers from '../controllers/stripeControllers';

const router = Router();

router.get('/checkout-success', (_, res) => {
    res.redirect('/checkout');
});

router.post(
    `/create-checkout-session`,
    express.json(),
    stripeControllers.createCheckoutSession
);

router.post(
    '/fulfill-checkout',
    express.raw({type: 'application/json'}),
    stripeControllers.fullfillCheckout
);

export default router;