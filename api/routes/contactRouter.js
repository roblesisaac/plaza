import { Router } from 'express';
import contact from '../controllers/contactControllers';
import checkIfHuman from '../middlewares/checkIfHuman';

const router = Router();

router.post('/contact-form', checkIfHuman, contact.sendContactEmail);

export default router;