import express from 'express';
import { transactionCategorizationService } from '../services/TransactionCategorization.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Bulk categorize transactions
router.post('/categorize', auth, async (req, res) => {
  try {
    const categorizedTransactions = await transactionCategorizationService.bulkCategorizeTransactions(req.user._id);
    res.json({
      message: 'Transactions categorized successfully',
      categorizedCount: categorizedTransactions.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create custom category
router.post('/custom-category', auth, async (req, res) => {
  try {
    const newCategory = await transactionCategorizationService.createCustomCategory(
      req.user._id, 
      req.body
    );
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category insights
router.get('/insights', auth, async (req, res) => {
  try {
    const categoryInsights = await transactionCategorizationService.generateCategoryInsights(req.user._id);
    res.json(categoryInsights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;