import express from 'express';
import * as commonImagesController from '@/controllers/common-images.controller';

const router = express.Router();

/** GET /common-images */
// 서버에서만 조회 가능
// router.get('/', commonImagesController.getImages);

/** POST /common-images */
router.post('/', commonImagesController.uploadImages);

/** DELETE /common-images */
router.delete('/', commonImagesController.deleteImages);

export default router;
