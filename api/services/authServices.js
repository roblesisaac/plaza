import { generateRandomNumber } from '../utils/tools';
import { throwError } from '../utils/errors';
import Users from '../models/users';
import { sendEmail } from './contactServices';
import config from '../config/environment';

export function checkIfAuthenticated(req) {
  return req.isAuthenticated() 
    ? {
      isLoggedIn: true,
      data: {
        _id: req.user._id,
        email: req.user.email,
        views: req.user.views,
        email_verified: req.user.email_verified,
        role: req.user.role,
        hideAllViews: req.user.hideAllViews,
        lastLoggedIn: req.user.lastLoggedIn
  
      }
    } : false;
}

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
      text: `Welcome to ${config.FRIENDLY_NAME}! Your verification code is ${newUser.email_verified}.`
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