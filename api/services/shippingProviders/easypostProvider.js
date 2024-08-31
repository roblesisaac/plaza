import fetch from 'node-fetch';
import config from '../../config/environment';

const API_BASE_URL = 'https://api.easypost.com/v2';

export async function validateAddress(address) {
    const formattedAddress = formatAddressForApiRequest(address);
    const endpoint = `${API_BASE_URL}/addresses`;
    const headers = getHeaders();

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ address: formattedAddress })
    });

    return await response.json();
}

export async function fetchRates(addressOrigin, addressDestination, shipment) {
    const formattedAddressOrigin = formatAddressForApiRequest(addressOrigin);
    const formattedAddressDestination = formatAddressForApiRequest(addressDestination);
    const formattedShipment = formatShipmentParcels(shipment);
    const endpoint = `${API_BASE_URL}/rates`;
    const headers = getHeaders();

    const formattedRateBody = {
        from_address: formattedAddressOrigin,
        to_address: formattedAddressDestination,
        parcel: formattedShipment
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedRateBody)
    });

    return await response.json();
}

export async function createShipment(addressOrigin, addressDestination, shipment) {
    const formattedAddressOrigin = formatAddressForApiRequest(addressOrigin);
    const formattedAddressDestination = formatAddressForApiRequest(addressDestination);
    const formattedShipment = formatShipmentParcels(shipment);
    const endpoint = `${API_BASE_URL}/shipments`;
    const headers = getHeaders();

    const formattedBody = {
        from_address: formattedAddressOrigin,
        to_address: formattedAddressDestination,
        parcel: formattedShipment
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formattedBody)
    });

    return await response.json();
}

function formatAddressForApiRequest(address) {
    return {
        name: address.name,
        street1: address.line1,
        city: address.city,
        state: address.state,
        zip: address.zipCode,
        country: 'US',
        company: address.company || '',
        phone: address.phone,
        email: address.email,
        residential: address.residential || false
    };
}

function formatShipmentParcels(shipment) {
    const { boxes } = shipment;
    const { dimensions } = boxes[0];

    return {
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        weight: dimensions.weight
    };
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'X-API-Key': config.SHIP.EASYPOST_API_KEY
    };
}