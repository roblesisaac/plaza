import { events } from '@ampt/sdk';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Users from '../models/users';
import config from './environment';
import { comparePassword } from '../utils/encryption';

passport
    .use(new LocalStrategy({ usernameField: 'email' }, authNativeUser))
    .use(new GoogleStrategy(config.GoogleConfig, authGoogleUser));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    const user = await Users.findOne(_id);

    done(null, user);
});

export async function authNativeUser(email, password, done) {
  const errorMessage = `The username or password you provided is incorrect.`;

  if (!email || !password) {
    return done(`Missing 'email' or 'password' properties.`, false);
  }

  const user = await Users.findUser(email);

  if (!user || !user.password) {
    return done(errorMessage, false);
  }

  const isCorrectPassword = await comparePassword(password, user.password);

  if (!isCorrectPassword) {
    return done(errorMessage, false);
  }

  const now = new Date();
  const pstOptions = { timeZone: 'America/Los_Angeles' };
  const lastLoggedIn = now.toLocaleString('en-US', pstOptions);

  await Users.updateUser(email, { lastLoggedIn });

  return done(null, user);
}

export async function authGoogleUser(req, accessToken, refreshToken, profile, done) {
  if(!isValidClientHost(req)) {
      return done(new Error('Invalid hostname'));
  }

  const { email } = profile._json;
  const existingUser = await Users.findUser(email);

  const user = {
      accessToken,
      ...profile._json
  };

  if(existingUser) {
      return done(null, await Users.updateUser(email, user));
  }

  const newUser = await Users.save(user);
  events.publish('users.saved', newUser);

  return done(null, newUser);
}

function isValidClientHost(req) {
    const clientHost = '.'+req.headers.host;
    return clientHost === config.domain;
}

export default passport;