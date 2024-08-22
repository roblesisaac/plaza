import { http } from '@ampt/sdk';

import { init } from './api';

const app = init();

http.node.use(app);