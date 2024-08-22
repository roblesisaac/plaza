export function isValidEmail(email) {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

export function isValidZipCode(zipCode) {
    return /^\d{5}(-\d{4})?$/.test(String(zipCode));
}

export function simpleZip(value) {
    const simplified = String(value).split('-')[0];

    return Number(simplified);
}