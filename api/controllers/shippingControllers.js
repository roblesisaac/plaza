import * as shippingService from '../services/shippingServices';
import { sendError } from '../utils/errors';

export default {
    createShipment: async (req, res) => {
        try {
            const { address, boxes, weight } = req.body;
            const { provider } = req.params;
            const shipment = { boxes, weight };

            const createdShipment = await shippingService.createShipment(address, shipment, provider);

            res.json(createdShipment);
        } catch (err) {
            sendError(res, err);
        }
    },
    estimatedShipping: async (req, res) => {
        try {
            const { zipCode, boxes, weight } = req.body;
            const shipment = { boxes, weight };

            const shippingEstimate = await shippingService.estimatedShippingCost(zipCode, shipment);

            res.json(shippingEstimate);
            
        } catch (err) {
            sendError(res, err);
        }
    },
    fetchCityAndState: async (req, res) => {
        try {
            const { zipCode } = req.params;
            
            res.json(await shippingService.fetchCityAndState(zipCode));
        } catch (err) {
            sendError(res, err);
        }
    },
    getRates: async (req, res) => {
        try {
            const shippingServiceProvider = req.params.provider;
            const { origin, destination, shipment } = req.body;

            res.json(
                await shippingService.fetchRates(origin, destination, shipment, shippingServiceProvider)
            );

        } catch (err) {
            sendError(res, err);
        }
    },
    purchaseLabel: async (req, res) => {
        try {
            const { rateId, orderId } = req.body;
            const purchasedLabel = await shippingService.purchaseLabel(orderId, rateId, req.params.provider);

            res.json(purchasedLabel);
        } catch (err) {
            sendError(res, err);
        }
    },
    validateAddress: async (req, res) => {
        try {
            const shippingServiceProvider = req.params.provider || 'shippo';
            const validationResult = await shippingService.validateAddress(req.body, shippingServiceProvider);          

            res.json(validationResult);
        } catch (err) {
            sendError(res, err);
        }
    }
}