import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import * as breadsController from '@/controllers/breads.controller';
import { createBreadValidator, validate } from '@/middlewares/validators/validate';

const router = Router();

// GET /breads
router.get('/', authenticateToken, breadsController.getBreads);

// GET /breads/:no
router.get('/:no', authenticateToken, breadsController.getBreadByNo);

// POST /breads
router.post('/', authenticateToken, validate(createBreadValidator), breadsController.createBread);

// PUT /breads/:id
router.put('/:id', authenticateToken, (req, res) => {
  res.send('Hello World');
});

// DELETE /breads/:id
router.delete('/:id', authenticateToken, (req, res) => {
  res.send('Hello World');
});

export default router;
