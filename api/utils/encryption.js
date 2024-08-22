import bcrypt from 'bcryptjs';
import config from '../config/environment';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { throwError } from './errors';

export async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throwError(error);
  }
}

export function decodeJWT(token) {
  try {
    const rsa_public = config.RSA_PUBLIC;
    return jwt.verify(token, rsa_public, { algorithm: 'RS256' });
  } catch (error) {
    throwError(error);
  }
}

export function decrypt(encryptedData, dataType) {
  try {
    if(!encryptedData) {
      return '';
    }

    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(config.CRYPT_KEY, 'hex'), Buffer.from(config.CRYPT_IV, 'hex'));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return {
      buffer: decrypted,
      string: decrypted.toString()
    }[dataType] || decrypted.toString();
  } catch (error) {
    throw new Error(`Error decrypting - ${error.message} Data: ${JSON.stringify(encryptedData)}.`);
  }
}

export function decryptWithKey(encryptedData, key) {
  try {
    const [ivHex, encryptedText, authenticationTagHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authenticationTag = Buffer.from(authenticationTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authenticationTag);

    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  } catch (error) {
    throwError(error);
  }
}

export function encrypt(data) {
  try {
    if (typeof data === 'number') {
      data = data.toString();
    }

    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(config.CRYPT_KEY, 'hex'), Buffer.from(config.CRYPT_IV, 'hex'));
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  } catch (error) {
    throwError(error);
  }
}

export function encryptWithKey(data, key) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    const authenticationTag = cipher.getAuthTag().toString('hex');
    return iv.toString('hex') + ':' + encryptedData + ':' + authenticationTag;
  } catch (error) {
    throwError(error);
  }
}

export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throwError(error);
  }
}

export function generateSymmetricKey() {
  try {
    return crypto.randomBytes(32);
  } catch (error) {
    throwError(error);
  }
}

export function generateToken(payload) {
  try {
    const exp = Math.floor(Date.now() / 1000) + (60 * 60);
    return jwt.sign({ payload, exp }, config.RSA_PRIVATE, { algorithm: 'RS256' });
  } catch (error) {
    throwError(error);
  }
}
