import express from 'express';
const router = express.Router();
import {plaidService} from '../services/plaidService.js';
import  auth from '../middleware/authMiddleware.js';

router.post('/create-link-token', auth, async (req, res) => {
  try {
    const linkToken = await plaidService.createLinkToken(req.user._id);
    res.json({ link_token: linkToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/exchange-public-token', auth, async (req, res) => {
  try {
    const { public_token } = req.body;
    const accounts = await plaidService.exchangePublicToken(public_token, req.user._id);
    res.json({ accounts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/sync-transactions/:accountId', auth, async (req, res) => {
  try {
    const transactions = await plaidService.syncTransactions(req.user._id, req.params.accountId);
    
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/balance/:accountId', auth, async (req, res) => {
  try {
    const balance = await plaidService.getAccountBalance(req.params.accountId);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get('/accounts', auth, async (req, res) => {
  try {
    const accounts = await plaidService.getAllAccounts(req.user._id);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/accounts/:accountId', auth, async (req, res) => {
  console.log('Backend: DELETE request for account', req.params.accountId, 'from user', req.user._id);
  try {
    const result = await plaidService.deleteAccount(req.user._id, req.params.accountId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;