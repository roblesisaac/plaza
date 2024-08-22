import { formatNumber } from './formats';
import { isValidDate } from './validation';
import { throwError } from './errors';

export async function delay(s) {
    try {
        return new Promise(resolve => setTimeout(resolve, s*1000));
    } catch (error) {
        throwError(error);
    }
}

export function extractDateFromId(id) {
    const matches = id.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z/g);
    if (matches && matches.length > 0) {
        const dateString = matches[0].replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');
        const date = new Date(dateString);
        return date
    }
    return "Invalid date";
}

export default function generateDate(inputDate) {
    try {
        if (inputDate && isMissingTime(inputDate)) {
            inputDate += generateRandomTime();
        }
        
        const d = isValidDate(inputDate);           
        const year = formatNumber(d.getUTCFullYear());
        const month = formatNumber(d.getUTCMonth() + 1);
        const day = formatNumber(d.getUTCDate());
        const hours = formatNumber(d.getUTCHours());
        const minutes = formatNumber(d.getUTCMinutes());
        const seconds = formatNumber(d.getUTCSeconds());
        
        function isMissingTime(date) {
            return !/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z$/.test(date) && !/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(date);
        }
        
        return `${year}-${month}-${day}T${hours}-${minutes}-${seconds}Z`;
    } catch (error) {
        throwError(error);
    }
}

function generateRandomTime() {
    try {
        const hours = formatNumber(Math.floor(Math.random() * 24));
        const mins = formatNumber(Math.floor(Math.random() * 60));
        const seconds = formatNumber(Math.floor(Math.random() * 60));
        return `-${hours}-${mins}-${seconds}`;
    } catch (error) {
        throwError(error);
    }
}

export function pacificTimezoneOffset() { 
    return -7 * 60 * 60 * 1000;
}

export function generateRandomString(length=8) {
    try {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    } catch (error) {
        throwError(error);
    }
}

export function generateRandomNumber(digits=6) {
    try {
        const min = 10 ** (digits - 1);
        const max = 10 ** digits - 1;
        const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
        return randomNumber;
    } catch (error) {
        throwError(error);
    }
}

export function isMatchingArrays(arr1, arr2) {
    try {
        if (arr1.length !== arr2.length) {
            return false;
        }
        
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        
        return true;
    } catch (error) {
        throwError(error);
    }
}

export function scrub(response, propsToRemove) {
    try {
        if(!response) return null;
        propsToRemove = Array.isArray(propsToRemove) ? propsToRemove : [propsToRemove];
        
        if(Array.isArray(response)) {
            return response.map(item => {
                for(const removeProp of propsToRemove) {
                    delete item[removeProp];
                }
                
                return item;
            });
        }
        
        for(const removeProp of propsToRemove) {
            delete response[removeProp];
        }
        
        return response;
    } catch (error) {
        throwError(error);
    }
}

export function sum(num1, num2) {
    try {
        const parsedNum1 = parseFloat(num1.replace(/[^0-9.]/g, ''));
        const parsedNum2 = parseFloat(num2.replace(/[^0-9.]/g, ''));
        const sum = parsedNum1 + parsedNum2;
        return isNaN(sum) ? 0 : sum;
    } catch (error) {
        throwError(error);
    }
}