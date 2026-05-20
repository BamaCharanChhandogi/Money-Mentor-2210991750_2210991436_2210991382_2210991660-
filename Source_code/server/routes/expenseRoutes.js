import express from 'express';
import { deleteExpense, getAllExpense, getSpecificExpense, postExpense, updateExpense } from '../controllers/expenseController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',auth,postExpense);
router.get('/',auth,getAllExpense);
router.get('/:id',auth,getSpecificExpense);
router.patch('/:id',auth,updateExpense);
router.delete('/:id',auth,deleteExpense);

export default router;