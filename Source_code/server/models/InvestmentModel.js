import mongoose from 'mongoose';

const investmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['stock', 'bond', 'etf', 'mutual_fund', 'crypto', 'real_estate']
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative']
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: [0, 'Purchase price cannot be negative']
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  marketData: {
    marketCap: Number,
    peRatio: Number,
    dividendYield: Number,
    fiftyTwoWeekHigh: Number,
    fiftyTwoWeekLow: Number
  },
  performanceMetrics: {
    totalReturn: Number,
    annualizedReturn: Number,
    volatility: Number
  },
  alerts: [{
    type: {
      type: String,
      enum: ['price_change', 'market_milestone', 'performance_threshold']
    },
    threshold: Number,
    message: String,
    triggered: {
      type: Boolean,
      default: false
    },
    triggeredAt: Date
  }],
  notes: [String]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating current value
investmentSchema.virtual('currentValue').get(function() {
  return this.quantity * this.currentPrice;
});

// Virtual for calculating total gain/loss
investmentSchema.virtual('totalGainLoss').get(function() {
  return this.currentValue - (this.quantity * this.purchasePrice);
});

// Virtual for calculating percentage return
investmentSchema.virtual('percentageReturn').get(function() {
  return ((this.currentValue - (this.quantity * this.purchasePrice)) / (this.quantity * this.purchasePrice)) * 100;
});

// Method to add performance alert
investmentSchema.methods.addAlert = function(type, threshold, message) {
  this.alerts.push({
    type,
    threshold,
    message,
    triggered: false
  });
  return this.save();
};

// Method to check and trigger alerts
investmentSchema.methods.checkAlerts = function() {
  this.alerts.forEach(alert => {
    if (!alert.triggered) {
      let shouldTrigger = false;
      
      switch(alert.type) {
        case 'price_change':
          shouldTrigger = Math.abs(this.percentageReturn) >= alert.threshold;
          break;
        case 'market_milestone':
          shouldTrigger = this.currentPrice >= alert.threshold;
          break;
      }

      if (shouldTrigger) {
        alert.triggered = true;
        alert.triggeredAt = new Date();
      }
    }
  });

  return this.save();
};

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;