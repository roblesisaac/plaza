import { throwError } from './errors';

export function formatNumber(num, pad = 2) {
    try {
        return num.toString().padStart(pad, '0');
    } catch (error) {
        throwError(error);
    }
}

export function formatPrice(value, { toFixed = 2, thousands = true } = {}) {
    try {
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        
        if (isNaN(numericValue)) {
            return 'Invalid Price';
        }
        
        let formatted = numericValue.toFixed(toFixed);
        
        if (thousands) {
            const parts = formatted.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            formatted = parts.join('.');
        }
        
        return '$' + formatted;
    } catch (error) {
        throwError(error);
    }
}

export function proper(str) {
    try {
        if (!str) return '';

        if(typeof str !== 'string') {
            str = String(str);
        }
        
        return str.toLowerCase().replace(/\b(\w)/g, function(firstLetter) {
            return firstLetter.toUpperCase();
        });
    } catch (error) {
        throwError(error);
    }
}

export function buildId(yyyymmdd) {
    try {
        const random = Math.random().toString(16).substring(2);
        return `${generateDate(yyyymmdd)}_${random}`;
    } catch (error) {
        throwError(error);
    }
}

export function formatDate(inputDate) { // outputs YYYY-MM-DD
    try {
        const date = new Date(inputDate);
        
        if (isNaN(date)) {
            throw new Error('Invalid date input');
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        throwError(error);
    }
}

export function formatDateFromId(id) {
    const matches = id.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z/g);
    if (matches && matches.length > 0) {
        const dateString = matches[0].replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');
        const utcDate = new Date(dateString);
        
        // Convert to PST (UTC-8)
        const pstDate = new Date(utcDate.getTime() - 12 * 60 * 60 * 1000);
        
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = months[pstDate.getUTCMonth()];
        const day = pstDate.getUTCDate();
        const year = pstDate.getUTCFullYear();
        
        const hours = pstDate.getUTCHours().toString().padStart(2, '0');
        const minutes = pstDate.getUTCMinutes().toString().padStart(2, '0');
        const seconds = pstDate.getUTCSeconds().toString().padStart(2, '0');
        
        const time = `${hours}:${minutes}:${seconds} PST`;
        
        return `${month} ${day}, ${year} at ${time}`;
    }
    return "Invalid date";
}