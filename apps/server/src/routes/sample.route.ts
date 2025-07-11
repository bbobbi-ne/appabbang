import { Router } from 'express';
import * as sampleController from '@/controllers/sample.controller';
import { asyncHandler } from '@/middlewares/error.middleware';

const router = Router();

router.get('/', asyncHandler(sampleController.getList));

router.get('/:no', asyncHandler(sampleController.getOne));

router.post('/', asyncHandler(sampleController.create));

router.put('/:no', asyncHandler(sampleController.update));

router.delete('/:no', asyncHandler(sampleController.remove));

export default router;
