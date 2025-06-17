import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import * as breadsController from '@/controllers/breads.controller';
import {
  createBreadValidator,
  deleteBreadValidator,
  deleteImageValidator,
  getBreadsValidator,
  updateBreadValidator,
  validate,
} from '@/middlewares/validators/validate';

const router = Router();

// GET /breads
router.get('/', authenticateToken, validate(getBreadsValidator), breadsController.getBreads);

// GET /breads/:no
router.get('/:no', authenticateToken, breadsController.getBreadByNo);

// POST /breads
router.post('/', authenticateToken, validate(createBreadValidator), breadsController.createBread);

// PUT /breads/:no
router.put('/:no', authenticateToken, validate(updateBreadValidator), breadsController.updateBread);

// DELETE /breads (여러건)
router.delete('/', authenticateToken, validate(deleteBreadValidator), breadsController.deleteBread);

// DELETE /breads/image (한건의 이미지 삭제)
router.delete(
  '/image',
  authenticateToken,
  validate(deleteImageValidator),
  breadsController.deleteImage,
);

export default router;
