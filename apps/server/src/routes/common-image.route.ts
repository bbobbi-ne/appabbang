import { Router } from 'express';
import * as commonImagesController from '@/controllers/common-image.controller';
import { asyncHandler } from '@/middlewares/error.middleware';
import { requireAdmin } from '@/middlewares/auth.middleware';

const router = Router();

/** GET /common-images : 공통 이미지 목록 조회 */
router.get('/', requireAdmin, asyncHandler(commonImagesController.getImages));

/** POST /common-images/upload : 공통 이미지 업로드 */
router.post('/upload', requireAdmin, asyncHandler(commonImagesController.uploadImages));

/** DELETE /common-images/delete : 공통 이미지 삭제 */
router.delete('/delete', requireAdmin, asyncHandler(commonImagesController.deleteImages));

export default router;
