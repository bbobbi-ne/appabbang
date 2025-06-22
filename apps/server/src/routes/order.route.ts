import { Router } from 'express';
// import { authenticateToken } from '@/middlewares/auth.middleware';
import * as orderController from '@/controllers/order.controller';

const router = Router();

// GET /order
router.get('/', orderController.getList);

// GET /order/:no
router.get('/:no', orderController.getOne);

// POST /order
router.post(
  '/',
  //   validate(_),
  orderController.create,
);

// PUT /order/:no
router.put(
  '/:no',

  //   validate(_),
  orderController.update,
);

// DELETE /order/:no
router.delete('/:no', orderController.remove);

export default router;
