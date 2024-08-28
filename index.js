import { http } from '@ampt/sdk';
import app from './api';

http.node.use(app);