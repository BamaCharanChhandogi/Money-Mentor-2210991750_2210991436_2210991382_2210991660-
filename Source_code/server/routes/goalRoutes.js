import express from 'express';
import { createGoal, getGoals, addContribution, deleteGoal } from '../controllers/goalController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, createGoal);
router.get('/:familyGroupId', auth, getGoals);
router.patch('/:id/contribute', auth, addContribution);
router.delete('/:id', auth, deleteGoal);

export default router;
