import { params } from '@ampt/sdk';

export default function isProd() {
  return params('ENV_NAME') === 'prod';
}