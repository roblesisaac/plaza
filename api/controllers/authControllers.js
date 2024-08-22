import passport from 'passport';
import * as authServices from '../services/authServices';
import { sendError } from '../utils/errors';

export function checkAuth(req, res) {
  res.json(authServices.checkIfAuthenticated(req));
};

export function loginNative(req, res, next) {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return sendError(res, err);
    }
    
    if (!user) {
      return sendError(res, 'Invalid email or password')
    }
    
    req.logIn(user, function(err) {
      if (err) {
        return sendError(res, err)
      }
      
      return res.json({
        data: user
      });
    });
  })(req, res, next);
}

export const googleLogin = passport.authenticate('google', { scope: ['email'] });

export function googleCallback(req, res, next) {
  passport.authenticate('google', (err, user) => {
    if(err) {
      return sendError(res, err);
    }

    if (!user) {
      return res.redirect('/login');
    }
    
    req.logIn(user, async (err) => {
      if (err) {
        return sendError(res, err);
      }
      
      // const { views } = await userApp.getUserPages(user);
      // const redirectUrl = `/${views[0] || ''}`;
      
      // return res.redirect(redirectUrl);
      res.redirect('/');
    });
  })(req, res, next);
}

export function logout(req, res) {
  req.logout(async (err) => {
    if (err) {
      return sendError(res, err);
    }
    
    res.redirect('/login');
  });
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    const newUser = await authServices.register(email, password);
    
    req.logIn(newUser, function(err) {
      if (err) {
        return sendError(res, err);
      }
      return res.json({
        data: newUser
      });
    });
    
  } catch(err) {
    sendError(res, err);
  }
}

export async function verifyUser(req, res) {
  try {
    const { email, code } = req.body;
    const user = await authServices.verifyUser(email, code);
    
    res.json(user);
  } catch (err) {
    sendError(res, err);
  }
}