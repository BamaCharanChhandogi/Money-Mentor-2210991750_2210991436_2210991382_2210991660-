import  express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getAdvice, getAnalysisExpenses, getBudgetAdherence } from '../controllers/financialAdviceController.js';
const router = express.Router();

router.get('/ai-advice',auth,getAdvice);
router.get('/expense-analysis',auth,getAnalysisExpenses);
router.get('/budget-adherence',auth,getBudgetAdherence);

export default router;