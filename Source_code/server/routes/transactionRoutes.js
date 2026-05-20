import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { 
  addTransaction, 
  getTransaction, 
  getTransactionById, 
  updateTransaction,
  exportTransactions 
} from '../controllers/transactionController.js';

const router = express.Router();

router.post('/', auth, addTransaction);
router.get('/', auth, getTransaction);
router.get('/export', auth, exportTransactions);
router.get('/:id', auth, getTransactionById);
router.patch('/:id', auth, updateTransaction);

export default router;