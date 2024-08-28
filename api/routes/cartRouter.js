import { Router } from 'express';
import cart from '../controllers/cartControllers';

const router = Router();

router.get('/cart', cart.getCart);
router.post('/cart', cart.saveCart);

export default router;