import fetch from 'node-fetch';
import config from '../../config/environment';
import { throwError } from '../../utils/errors';

const API_BASE_URL = 'https://api.shipengine.com/v1';

export async function createShipment(addressOrigin, addressDestination, shipment) {
    const formattedAddressOrigin = formatAddressForApiRequest(addressOrigin);
    const formattedAddressDestination = formatAddressForApiRequest(addressDestination);
    const formattedShipment = formatShipmentParcels(shipment);
    const endpoint = `${API_BASE_URL}/shipments`;
    const headers = getHeaders();

    const formattedBody = {
        shipments: [{
            ship_from: formattedAddressOrigin,
            ship_to: formattedAddressDestination,
            carrier_id: 'se-531986',
            packages: formattedShipment
        }]
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedBody)
    });

    try {
        const json = await response.json();
        const { shipments, errors } = json;

        if(errors) {
            throw new Error(`HTTP error! status: ${JSON.stringify(errors, null, 2)}`);
        }

        const rates = await getRates(shipments[0]);

        console.log(JSON.stringify(rates, null, 2))

        return rates;
    } catch (err) {
        throwError(err);
    }
}

export async function fetchRates(addressOrigin, addressDestination, shipment) {
    const formattedAddressOrigin = formatAddressForApiRequest(addressOrigin);
    const formattedAddressDestination = formatAddressForApiRequest(addressDestination);
    const formattedShipment = formatShipmentParcels(shipment);
    const endpoint = `${API_BASE_URL}/rates`;
    const headers = getHeaders();

    const formattedRateBody = {
        rate_options: {
            carrier_ids: [] // Add specific carrier IDs if needed
        },
        shipment: {
            ship_from: formattedAddressOrigin,
            ship_to: formattedAddressDestination,
            packages: formattedShipment
        }
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedRateBody)
    });

    return await response.json();
}

export function normalizeRates(fetchedRates) {
    return fetchedRates.rates.map(rate => ({
        _id: rate.rate_id,
        courier_name: rate.carrier_friendly_name,
        price: parseFloat(rate.shipping_amount.amount),
        delivered_by: rate.delivery_days 
          ? `${rate.delivery_days} days` 
          : "Delivery time not available",
        logo_url: '' // ShipEngine doesn't provide logos, you might need to handle this separately
    }));
}

export async function purchaseLabel(rateId) {
    const endpoint = `${API_BASE_URL}/labels`;
    const body = { 
        rate_id: rateId,
        label_format: 'pdf'
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body)
    });

    return await response.json();
}

export async function validateAddress(address) {
    const formattedAddress = formatAddressForApiRequest(address);
    const endpoint = `${API_BASE_URL}/addresses/validate`;
    const headers = getHeaders();

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedAddress)
    });

    return await response.json();
}

function formatAddressForApiRequest(address) {
    return {
        name: address.name || address.customerName,
        company_name: address.company,
        address_line1: address.line1,
        city_locality: address.city,
        state_province: address.state,
        postal_code: address.zipCode,
        country_code: 'US',
        phone: address.phone || config.CONTACT.PHONE,
        address_residential_indicator: address.residential ? 'yes' : 'no'
    };
}

function formatShipmentParcels(shipment) {
    const { boxes } = shipment;

    return boxes.map(({ length, width, height, totalWeight }) => ({
        length: {
            value: length,
            unit: 'inch'
        },
        width: {
            value: width,
            unit: 'inch'
        },
        height: {
            value: height,
            unit: 'inch'
        },
        weight: {
            value: totalWeight,
            unit: 'pound'
        }
    }));
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'API-Key': config.SHIP.SHIP_ENGINE_SAND
    };
}

async function getRates({ shipment_id }) {
    const endpoint = `${API_BASE_URL}/shipments/${shipment_id}/rates`;
    const headers = getHeaders();

    const response = await fetch(endpoint, {
        method: 'GET',
        headers
    });

    const json = await response.json();

    return {
        endpoint,
        shipment_id,
        rates: json
    };
}

export default {
    createShipment,
    fetchRates,
    normalizeRates,
    purchaseLabel,
    validateAddress
};