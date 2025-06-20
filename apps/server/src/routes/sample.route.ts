import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import * as sampleController from '@/controllers/sample.controller';

const router = Router();

// GET /sample
router.get('/', sampleController.getList);

// GET /sample/:no
router.get('/:no', sampleController.getOne);

// POST /sample
router.post(
  '/',
  authenticateToken,
  //   validate(_),
  sampleController.create,
);

// PUT /sample/:no
router.put(
  '/:no',
  authenticateToken,
  //   validate(_),
  sampleController.update,
);

// DELETE /sample/:no
router.delete('/:no', authenticateToken, sampleController.remove);

export default router;
