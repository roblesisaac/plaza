import express from 'express';
import { Router } from 'express';

import sessionStore from './middlewares/sessionStore';
import redirect404s from './middlewares/404Redirects';
import passport from './config/passport';

import cartRoutes from './routes/cartRoutes';
import contactRoutes from './routes/contactRoutes';
import authRoutes from './routes/authRoutes';
import shippingRoutes from './routes/shippingRoutes';
import dbRoutes from './routes/dbRoutes';
import orderRoutes from './routes/orderRoutes';
import stripeRoutes from './routes/stripeRoutes';

export const routes = {
    authRoutes,
    cartRoutes,
    contactRoutes,
    shippingRoutes,
    dbRoutes,
    orderRoutes,
    stripeRoutes
};

export const middlewares = {
    redirect404s,
    sessionStore,
    passport
};

export function initAllRoutes(api) {
    for (const routeKey in routes) {
        if (Object.hasOwnProperty.call(routes, routeKey)) {
            routes[routeKey](api);
        }
    }
}

export function init() {
    const app = express();

    app
        .use(middlewares.sessionStore())
        .use(middlewares.passport.initialize())
        .use(middlewares.passport.session())
        .use(express.json());

    // Routes
    const api = Router();
    app.use('/api', api);

    routes.authRoutes(api);
    routes.contactRoutes(api);
    routes.cartRoutes(api);
    routes.shippingRoutes(api);
    routes.dbRoutes(api);
    routes.orderRoutes(api);
    routes.stripeRoutes(api);

    app.use(middlewares.redirect404s);

    return app;
}