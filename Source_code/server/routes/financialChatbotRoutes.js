import  express from 'express';
import auth from '../middleware/authMiddleware.js';
import { financialChatbot } from '../controllers/financialChatbotController.js';
const router = express.Router();

router.post('/chat',auth,financialChatbot);

export default router;