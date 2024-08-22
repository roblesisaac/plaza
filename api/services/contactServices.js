import nodemailer from 'nodemailer';
import inlineBase64 from 'nodemailer-plugin-inline-base64';

import config from '../config/environment';
import { isValidEmail } from '../utils/validation';
import { proper } from '../utils/formats';
import { throwError } from '../utils/errors';

export async function sendEmail(emailData) {
    const { from, to, replyTo, subject, text, html } = emailData;
    const hasText = !!text?.length || !!html?.length;
    const requiredFieldsMet = hasText && isValidEmail(to)

    if(!requiredFieldsMet) {
        throwError('Please provide a valid email address and message.');
    }

    const transporter = nodemailer.createTransport({
        host: 'email-smtp.us-west-1.amazonaws.com',
        port: 465,
        secure: true,
        auth: {
            user: config.CONTACT.SES_USER,
            pass: config.CONTACT.SES_PASS
        },
        debug: true
    });

    const mailOptions = {
        from,
        to,
        replyTo: replyTo || `<${from}>`,
        subject
    };

    if(text) {
        mailOptions.text = text;
    }

    if(html) {
        mailOptions.html = html;
    }

    try {
        transporter.use('compile', inlineBase64());
        await transporter.sendMail(mailOptions);

        return { 
            success: true,
            from,
            to,
            message: `Message sent successfully to ${to}!`
        };

    } catch (error) {
        throwError(error);
    }
}

export async function sendContactEmail({ from, name, text }) {
    try {
        if(!isValidEmail(from)) {
            return throwError('Please provide a valid email.');
        }

        await sendEmail({ 
            from: config.CONTACT.EMAIL,
            replyTo: from,
            to: config.CONTACT.EMAIL,
            subject: `${config.APP_NAME} Contact From Message from ${proper(name)}`,
            text
        });

        return {
            success: true,
            message: `${proper(name)}, thank you for reaching out! Expect a reply at ${from} shortly.`
        }
    } catch (err) {
        throwError(err);
    }
}