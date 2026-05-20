import  express from 'express';
import auth from '../middleware/authMiddleware.js';
import {postBudget,getAllBudgets,getSpecificBudget,updateBudget,deleteBudget} from '../controllers/budgetsController.js';
const router = express.Router();

router.post('/',auth,postBudget);
router.get('/',auth,getAllBudgets);
router.get('/:id',auth,getSpecificBudget);
router.patch('/:id',auth,updateBudget);
router.delete('/:id',auth,deleteBudget);

export default router;