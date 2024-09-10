import { Router } from 'express';
import * as authController from '../controllers/authControllers';
import checkIfHuman from '../middlewares/checkIfHuman';

const router = Router();

router.get('/auth/check', authController.checkAuth);
router.get('/auth/recaptcha/public', authController.getPublicReCaptchaToken);
router.get('/auth/logout', authController.logout);
router.post('/auth/login/native', checkIfHuman, authController.loginNative);
router.post('/auth/register/native', checkIfHuman, authController.register);
router.get('/auth/google', authController.googleLogin);
router.get('/auth/google/callback', authController.googleCallback);
router.post('/auth/verify', authController.verifyUser);

export default router;