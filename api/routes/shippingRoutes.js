import shippingControllers from '../controllers/shippingControllers';
import permit from '../utils/permit';

export default (api) => {
    api.post('/shipping/rates/estimate/:provider?', shippingControllers.estimatedShipping);
    api.post('/shipping/create/shipment/:provider?', shippingControllers.createShipment);
    api.post('/shipping/address/validate/:provider?', shippingControllers.validateAddress);
    api.post('/shipping/rates/:provider?', shippingControllers.getRates);
    api.post('/shipping/purchase-label/:provider?', permit('admin'), shippingControllers.purchaseLabel);
    api.get('/shipping/zip/:zipCode', shippingControllers.fetchCityAndState);
}