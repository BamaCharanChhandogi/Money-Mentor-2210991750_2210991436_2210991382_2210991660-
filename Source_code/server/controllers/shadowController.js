import { generateShadowReport } from '../services/shadowService.js';

/**
 * GET /api/shadow/report
 * Runs the full AI Shadow pipeline and returns the structured report.
 */
export const getShadowReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const report = await generateShadowReport(userId);
    res.json(report);
  } catch (error) {
    console.error('Error generating AI Shadow report:', error);
    res.status(500).json({
      error: 'Failed to generate AI Shadow report. Please try again.',
    });
  }
};

/**
 * POST /api/shadow/dismiss
 * Body: { alertId: string }
 * For MVP, this is a no-op on the server — client handles persistence in localStorage.
 * Returns 200 OK so the client can safely call it.
 */
export const dismissAlert = async (req, res) => {
  try {
    const { alertId } = req.body;
    if (!alertId) {
      return res.status(400).json({ error: 'alertId is required' });
    }
    // Future: save to DB. For MVP — acknowledge only.
    res.json({ success: true, dismissedAlertId: alertId });
  } catch (error) {
    console.error('Error dismissing alert:', error);
    res.status(500).json({ error: 'Failed to dismiss alert.' });
  }
};
