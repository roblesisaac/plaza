export function formatAsPrice(number) {
    if(!number) {
        return '$0.00';
    }
    
    return number.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD'
    });
}

export function formatPhone(number) {
    try {
        return String(number).replace(/\D/g, '').replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } catch (e) {
        return number;
    }
}

export function formatProper(string) {
    string = string.toString();
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatTitle(string) {
    string = string.toString();
    return string
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}