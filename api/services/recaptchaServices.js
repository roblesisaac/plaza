import config from '../config/environment';
import fetch from 'node-fetch';
import { throwError } from '../utils/errors';

export default async function(recaptchaToken) {
    try {
        if(!recaptchaToken) {
            return {
                success: false,
                errorMessage: 'No reCAPTCHA token provided...'
            }
        }
    
        const verificationResult = await fetchReCaptchaVerification(config.RECAPTCHA_KEY, recaptchaToken);
        
        if (verificationResult?.score >= 0.5 || verificationResult?.success === true) {
            return {
                success: true,
                verificationResult
            };
        }
        
        console.error('reCAPTCHA failed:', verificationResult);
        
        return {
            success: false,
            errorMessage: `reCAPTCHA failed: ${verificationResult['error-codes'].join(' ')}`
        };
    } catch (error) {
        throwError(error);
    }
}

async function fetchReCaptchaVerification(RECAPTCHA_KEY, recaptchaToken) {
    const params = `secret=${RECAPTCHA_KEY}&response=${recaptchaToken}`;
    const url = 'https://www.google.com/recaptcha/api/siteverify?' + params;
    
    try {
        const response = await fetch(url, { method: 'POST' });
        return response.json();
    } catch (error) {
        throwError(error);
    }
}