import Investment from "../models/InvestmentModel.js";
import { getStockDetails } from "../services/stockService.js";
export const addInvestments = async (req, res) => {
  try {
    // Fetch additional market data during investment creation
    const marketDetails = await getStockDetails(req.body.symbol);
    
    const investment = new Investment({
      ...req.body,
      user: req.user._id,
      currentPrice: marketDetails.currentPrice || req.body.purchasePrice,
      marketData: {
        marketCap: marketDetails.marketCap,
        fiftyTwoWeekHigh: marketDetails.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: marketDetails.fiftyTwoWeekLow
      }
    });
    
    // Optionally add default alerts
    await investment.addAlert('price_change', 10, 'Significant price movement detected');
    
    await investment.save();
    res.status(201).send(investment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });
    res.send(investments);
  } catch (error) {
    res.status(500).send();
  }
};
export const getInvestmentsById = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!investment) {
      return res.status(404).send();
    }
    res.send(investment);
  } catch (error) {
    res.status(500).send();
  }
};
export const updateInvestments = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["quantity", "currentPrice", "lastUpdated"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!investment) {
      return res.status(404).send();
    }

    updates.forEach((update) => (investment[update] = req.body[update]));
    await investment.save();
    res.send(investment);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!investment) {
      return res.status(404).send();
    }
    res.send(investment);
  } catch (error) {
    res.status(500).send();
  }
};
// get portfolio summary
export const getPortfolioSummary = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });

    const summary = {
      totalInvestments: investments.length,
      assetAllocation: {},
      performanceSummary: {
        totalValue: 0,
        totalCost: 0,
        totalGainLoss: 0,
        overallReturn: 0
      },
      alertsSummary: {
        totalAlerts: 0,
        triggeredAlerts: 0
      }
    };

    investments.forEach(investment => {
      // Asset Allocation
      summary.assetAllocation[investment.type] = 
        (summary.assetAllocation[investment.type] || 0) + investment.currentValue;

      // Performance Summary
      summary.performanceSummary.totalValue += investment.currentValue;
      summary.performanceSummary.totalCost += investment.quantity * investment.purchasePrice;
      
      // Alerts Summary
      summary.alertsSummary.totalAlerts += investment.alerts.length;
      summary.alertsSummary.triggeredAlerts += investment.alerts.filter(a => a.triggered).length;
    });

    // Calculate Overall Return
    summary.performanceSummary.totalGainLoss = 
      summary.performanceSummary.totalValue - summary.performanceSummary.totalCost;
    summary.performanceSummary.overallReturn = 
      (summary.performanceSummary.totalGainLoss / summary.performanceSummary.totalCost) * 100;

    res.send(summary);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addInvestmentAlert = async (req, res) => {
  try {
    const { investmentId, type, threshold, message } = req.body;
    
    const investment = await Investment.findOne({
      _id: investmentId,
      user: req.user._id
    });

    if (!investment) {
      return res.status(404).send('Investment not found');
    }

    await investment.addAlert(type, threshold, message);
    res.status(201).send(investment);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
// update price
export const updatePrice = async (req, res) => {
  try {
    
    const investments = await Investment.find({ user: req.user._id });
    const updatedInvestments = [];

    for (let investment of investments) {
      try {
        // Get latest stock details
        const stockDetails = await getStockDetails(investment.symbol);
        
        
        // Calculate basic performance metrics
        const totalReturn = ((stockDetails.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
        const daysSincePurchase = (new Date() - new Date(investment.purchaseDate)) / (1000 * 60 * 60 * 24);
        const annualizedReturn = (totalReturn / daysSincePurchase) * 365;

        // Update the investment with available data
        investment.currentPrice = stockDetails.currentPrice;
        investment.lastUpdated = new Date();
        
        // Update marketData with available fields
        investment.marketData = {
          marketCap: stockDetails.marketCap,
          fiftyTwoWeekHigh: stockDetails.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: stockDetails.fiftyTwoWeekLow,
          // Set other fields to null or previous values if not available
          peRatio: investment.marketData?.peRatio || null,
          dividendYield: investment.marketData?.dividendYield || null
        };

        // Update performance metrics
        investment.performanceMetrics = {
          totalReturn: totalReturn,
          annualizedReturn: annualizedReturn,
          volatility: null // Not available from current API
        };

        // Check for any price-based alerts
        await investment.checkAlerts();
        
        // Save the updated investment
        const updatedInvestment = await investment.save();
        updatedInvestments.push({
          symbol: investment.symbol,
          newPrice: stockDetails.currentPrice,
          priceChange: stockDetails.currentPrice - investment.currentPrice
        });

      } catch (error) {
        console.error(`Error updating ${investment.symbol}:`, error);
        // Continue with next investment if one fails
        continue;
      }
    }

    res.send({ 
      message: 'Investment prices and metrics updated successfully',
      updatedCount: updatedInvestments.length,
      updates: updatedInvestments
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).send({
      error: 'Error updating investment prices',
      details: error.message
    });
  }
};
