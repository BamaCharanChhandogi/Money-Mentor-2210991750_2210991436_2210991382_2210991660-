import  express from 'express';
import auth from '../middleware/authMiddleware.js';
import { addInsurance, deleteInsurance, getInsurance, getSpecificInsurance, InsuranceRecommendation, updateInsurance } from '../controllers/insurancePolicyController.js';
const router = express.Router();

router.post('/',auth,addInsurance);
router.get('/',auth,getInsurance);
router.patch('/:id',auth,updateInsurance);
router.delete('/:id',auth,deleteInsurance);
router.get('/recommendations',auth,InsuranceRecommendation);
router.get('/:id',auth,getSpecificInsurance);

export default router;