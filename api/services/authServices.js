import { generateRandomNumber } from '../utils/tools';
import { throwError } from '../utils/errors';
import Users from '../models/users';
import { sendEmail } from './contactServices';
import config from '../config/environment';
import welcomeEmailTemplate from '../emails/welcome-email-template';

export async function register(email, password) {
  try {
    const newUser = await Users.save({
      email, 
      email_verified: generateRandomNumber(),
      password
     });

    await sendEmail({ 
      from: `${config.FRIENDLY_NAME} <${config.CONTACT.EMAIL}>`,
      to: newUser.email,
      subject: 'Thank you for signing up!',
      html: welcomeEmailTemplate(newUser)
    });

    sendEmail({ 
      from: `${config.FRIENDLY_NAME} <${config.CONTACT.EMAIL}>`,
      to: config.CONTACT.EMAIL,
      subject: 'New User Signed Up',
      html: `${newUser.email} Signed Up.`
    });

    return newUser;
    
  } catch (err) {
    throwError(err);
  }
}

export async function verifyUser(email, code) {
  try {
    const user = await Users.findUser(email);

    if(user.email_verified !== code) {
      return {
        success: false,
        message: 'Invalid verification code.'
      }
    }

    const verifiedUser = await Users.updateUser(email, 
      { email_verified: true } 
    );

    return {
      success: true,
      data: verifiedUser
    }

  } catch (err) {
    throwError(err);
  }
}