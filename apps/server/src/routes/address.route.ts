import { Router } from 'express';
import * as addressController from '@/controllers/address.controller';
import { updateAddressValidator, validate } from '@/middlewares/validators/validate';
import { createAddressValidator } from '@/middlewares/validators/validate';

const router = Router();

// GET /address
router.get('/', addressController.getList);

// GET /address/:no
router.get('/:no', addressController.getOne);

// POST /address
router.post('/', validate(createAddressValidator), addressController.create);

// PUT /address/:no
router.put('/:no', validate(updateAddressValidator), addressController.update);

// DELETE /address/:no
router.delete('/:no', addressController.remove);

export default router;
