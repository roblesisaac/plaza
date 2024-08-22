import * as authController from '../controllers/authControllers';
import checkIfHuman from '../middlewares/checkIfHuman';

export default function(api) {
    api.get('/auth/check', authController.checkAuth);
    api.get('/auth/logout', authController.logout);
    api.post('/auth/login/native', checkIfHuman, authController.loginNative);
    api.post('/auth/register/native', checkIfHuman, authController.register);
    api.get('/auth/google', authController.googleLogin);
    api.get('/auth/google/callback', authController.googleCallback);
    api.post('/auth/verify', authController.verifyUser);
}