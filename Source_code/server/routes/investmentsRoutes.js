import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { addInvestments, deleteInvestment, getInvestments, getInvestmentsById, getPortfolioSummary, updateInvestments, updatePrice } from '../controllers/investmentsController.js';

const router = express.Router();

router.post('/',auth,addInvestments);
router.get('/',auth,getInvestments);
router.patch('/:id',auth,updateInvestments);
router.delete('/:id',auth,deleteInvestment);
router.get('/summary',auth,getPortfolioSummary);
router.get('/:id',auth,getInvestmentsById);
router.post('/update-prices',auth,updatePrice);
export default router;