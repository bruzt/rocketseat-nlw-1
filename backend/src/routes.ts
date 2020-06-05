import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import pointControllerValidator from './validators/pointControllerValidator';

import itemController from './controllers/itemController';
import pointController from './controllers/pointController';

const router = express.Router();
const upload = multer(multerConfig);

router.get('/items', itemController.index);

router.get('/points', pointController.index);
router.get('/points/:id', pointController.show);
router.post('/points', upload.single('image'), pointControllerValidator.store, pointController.store);

export default router;