import { Router } from 'express';
import shippingControllers from '../controllers/shippingControllers';
import permit from '../utils/permit';

const router = Router();

router.post('/shipping/rates/estimate/:provider?', shippingControllers.estimatedShipping);
router.post('/shipping/create/shipment/:provider?', shippingControllers.createShipment);
router.post('/shipping/address/validate/:provider?', shippingControllers.validateAddress);
router.post('/shipping/rates/:provider?', shippingControllers.getRates);
router.post('/shipping/purchase-label/:provider?', permit('admin'), shippingControllers.purchaseLabel);
router.get('/shipping/zip/:zipCode', shippingControllers.fetchCityAndState);

export default router;