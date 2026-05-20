import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { addBankAccount, deleteBankAccount, getBankAccount, getBankAccountById, updateBankAccount } from '../controllers/bankController.js';

const router = express.Router();

// router.post('/',auth,addBankAccount);
router.get('/',auth,getBankAccount);
router.get('/:id',auth,getBankAccountById);
router.patch('/:id',auth,updateBankAccount);
router.delete('/:id',auth,deleteBankAccount);
export default router;