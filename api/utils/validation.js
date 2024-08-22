import { throwError } from './errors';

export function isValidEmail(email) {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    } catch (error) {
        throwError(error);
    }
}

export function isValidDate(inputDate) {
    try {
        if (inputDate) {
            const [date, time] = inputDate.split('T');
            const [year, month, day] = date.split('-');
            const [hours, minutes, seconds] = time ? (time.includes('-') ? time.split('-') : time.split(':')) : [0, 0, 0];
            return new Date(Date.UTC(year, month - 1, day, Number(hours), Number(minutes), Number(seconds)));
        } else {
            return new Date(Date.now() + pacificTimezoneOffset());
        }
    } catch (error) {
        throwError(error);
    }
}