import express from 'express';

import itemController from './controllers/itemController';
import pointController from './controllers/pointController';

const router = express.Router();

router.get('/items', itemController.index);

router.get('/points', pointController.index);
router.get('/points/:id', pointController.show);
router.post('/points', pointController.store);

export default router;