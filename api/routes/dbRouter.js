import { Router } from 'express';
import dbControllers from '../controllers/dbControllers';

const router = Router();

router.get('/db/:collection', dbControllers.findAll);
router.get('/db/:collection/:id', dbControllers.findOne);
router.post('/db/:collection', dbControllers.saveNewItem);
router.put('/db/:collection/:id', dbControllers.updateItem);
router.delete('/db/:collection/:id', dbControllers.deleteItem);

export default router;