import fetch from 'node-fetch';
import { throwError } from '../utils/errors';
import config from '../config/environment';
import ZipCodes from '../models/zipcodes';
import { getStripeOrderSession, sendOrderStatusEmail } from './orderServices';

import orders from '../models/orders';

// Import provider-specific functions
import * as easyshipProvider from './shippingProviders/easyshipProvider';
import * as easypostProvider from './shippingProviders/easypostProvider';
import * as shippoProvider from './shippingProviders/shippoProvider';
import * as shipEngineProvider from './shippingProviders/shipEngineProvider';

const PROVIDERS = {
    EASYSHIP: 'easyship',
    EASYPOST: 'easypost',
    SHIPPO: 'shippo',
    SHIP_ENGINE: 'ship_engine'
};

const DEFAULT_PROVIDER = PROVIDERS.EASYSHIP;

const providerMap = {
    [PROVIDERS.EASYSHIP]: easyshipProvider,
    [PROVIDERS.EASYPOST]: easypostProvider,
    [PROVIDERS.SHIPPO]: shippoProvider,
    [PROVIDERS.SHIP_ENGINE]: shipEngineProvider
};

export async function validateAddress(address, mailingServiceProvider = DEFAULT_PROVIDER) {
    try {
        // const provider = providerMap[mailingServiceProvider];
        const provider = providerMap[PROVIDERS.SHIPPO];
        if (!provider) {
            throw new Error('Invalid mailing service provider')
        }
        
        return await provider.validateAddress(address);
    } catch (err) {
        throwError(err);
    }
}

export async function fetchRates(addressOrigin, addressDestination, shipment, mailingServiceProvider = DEFAULT_PROVIDER) {
    try {
        addressOrigin = addressOrigin || config.ADDRESS_ORIGIN;
        
        const provider = providerMap[mailingServiceProvider];
        if (!provider) {
            throw new Error('Invalid mailing service provider')
        }
        
        const rates = await provider.fetchRates(addressOrigin, addressDestination, shipment);
        
        if (rates?.error) {
            throw new Error(`${rates.error.message} - Details: ${JSON.stringify(rates.error.details)}`);
        }
        
        return rates;
    } catch (err) {
        throwError(err);
    }
}

export async function estimatedShippingCost(zipCode, shipment, mailingServiceProvider = DEFAULT_PROVIDER) {
    const { city, state } = await fetchCityAndState(zipCode);
    const destination = { city, state, zipCode };
    
    const { rates } = await fetchRates(config.ADDRESS_ORIGIN, destination, shipment, mailingServiceProvider);
    return findLowestRate(rates, mailingServiceProvider);
}

export async function createShipment(addressDestination, shipment, mailingServiceProvider = DEFAULT_PROVIDER) {
    try {
        const provider = providerMap[mailingServiceProvider];
        if (!provider) {
            throw new Error('Invalid mailing service provider');
        }
        
        const fetchedShipment = await provider.createShipment(config.ADDRESS_ORIGIN, addressDestination, shipment);
        
        if (fetchedShipment?.error) {
            throw new Error(`${fetchedShipment.error.message} - Details: ${JSON.stringify(fetchedShipment.error.details)}`);
        }
        
        if(provider.normalizeRates) {
            provider.normalizeRates(fetchedShipment);
        }
        
        fetchedShipment.rates.sort((a, b) => a.price - b.price);
        
        return fetchedShipment;
    } catch (err) {
        throwError(err);
    }
}

export async function purchaseLabel(orderId, rateId, mailingServiceProvider = DEFAULT_PROVIDER) {
    try {
        const order = await orders.findOne(orderId);
        
        if (!order) {
            throw new Error('Order not found');
        }
        
        if(!orderStatusIsAllowed(order.status)) {
            return {
                success: false,
                message: `Order status "${order.status}" is not allowed`,
                order
            }
        }
        
        const provider = providerMap[mailingServiceProvider];
        
        if (!provider) {
            throw new Error('Invalid mailing service provider');
        }
        
        const purchasedLabel = await provider.purchaseLabel(rateId);
        const labelError = provider.labelHasError && provider.labelHasError(purchasedLabel);

        if(labelError) {
            throw new Error(labelError);
        }
        
        const { purchasedLabelUrl, trackingUrl } = provider.extractLabelUrls(purchasedLabel);
        
        const updatedOrder = await orders.update(orderId, { 
            purchasedLabelUrl, 
            trackingUrl,
            status: 'shipped' 
        });

        const stripedOrder = await getStripeOrderSession(updatedOrder);
        await sendOrderStatusEmail(stripedOrder);

        return { 
            purchasedLabel, 
            updatedOrder 
        };
    } catch (err) {
        throwError(err);
    }
}

export async function fetchCityAndState(zipCode) {
    try {
        const existingZipCodeData = await ZipCodes.findOne({ zipCode });
        
        if (existingZipCodeData) {
            return {
                city: existingZipCodeData.city,
                state: existingZipCodeData.state
            };
        }
        
        const endpoint = 'https://app.zipcodebase.com/api/v1/search';
        const url = `${endpoint}?&codes=${zipCode}&country=US&apikey=${config.SHIP.ZIP_CODE_BASE}`;
        
        const response = await fetch(url);
        const { results } = await response.json();
        const zipCode_data = results?.[zipCode]?.[0];
        
        if (!zipCode_data) {
            return {
                error: true,
                message: 'Invalid Zip Code',
                response,
                url
            }
        }
        
        await ZipCodes.save(zipCode_data);
        
        return zipCode_data
    } catch (err) {
        throwError(err);
    }
}

function findLowestRate(rates, mailingServiceProvider = DEFAULT_PROVIDER) {
    if (!Array.isArray(rates)) {
        return rates;
    }
    
    const totalCostField = mailingServiceProvider === PROVIDERS.EASYSHIP ? 'total_charge' : 'total_cost';
    
    const lowestRate = rates.reduce((lowest, rate) => {
        return (!lowest || rate[totalCostField] < lowest[totalCostField]) ? rate : lowest;
    }, null);
    
    if (!lowestRate) {
        return throwError('No rates found');
    }
    
    return lowestRate;
}

function orderStatusIsAllowed(orderStatus) {
    const orderStatuses = [ 
        'CREATED', 
        'ON_HOLD', 
        'PROCESSING', // MAX STATUS
        'CANCELLED', 
        'SHIPPED', 
        'DELIVERED', 
        'RETURNED' 
    ];

    const statusIndex = orderStatuses.indexOf(orderStatus.toUpperCase());
    const maxIndex = orderStatuses.indexOf('PROCESSING');
    
    return statusIndex !== -1 && statusIndex <= maxIndex;
}