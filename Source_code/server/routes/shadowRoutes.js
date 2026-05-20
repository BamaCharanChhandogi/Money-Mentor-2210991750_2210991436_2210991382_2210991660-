import express from 'express';
import { getShadowReport, dismissAlert } from '../controllers/shadowController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Both routes require authentication
router.get('/report', authMiddleware, getShadowReport);
router.post('/dismiss', authMiddleware, dismissAlert);

export default router;
