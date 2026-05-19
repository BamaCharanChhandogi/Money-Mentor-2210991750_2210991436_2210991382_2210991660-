import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PortfolioSummary = ({ portfolioSummary }) => {
  if (!portfolioSummary) return null;

  // Prepare data for asset allocation pie chart
  const assetAllocationData = Object.entries(portfolioSummary.assetAllocation)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
      value
    }));

  const COLORS = ['#C9A24A', '#57564F', '#6B8E5A', '#B8745C', '#8F6E2E'];

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value?.toFixed(2)}%`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Portfolio Summary</h2>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Performance Overview</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Value</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(portfolioSummary.performanceSummary.totalValue)}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Cost</p>
              <p className="text-xl font-bold">
                {formatCurrency(portfolioSummary.performanceSummary.totalCost)}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Gain/Loss</p>
              <p className={`text-xl font-bold ${
                portfolioSummary.performanceSummary.totalGainLoss >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatCurrency(portfolioSummary.performanceSummary.totalGainLoss)}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Overall Return</p>
              <p className={`text-xl font-bold ${
                portfolioSummary.performanceSummary.overallReturn >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {formatPercentage(portfolioSummary.performanceSummary.overallReturn)}
              </p>
            </div>
          </div>
          
          {/* Alert Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Alerts Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Total Alerts</p>
                <p className="text-lg font-bold">{portfolioSummary.alertsSummary.totalAlerts}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Triggered Alerts</p>
                <p className="text-lg font-bold text-amber-600">
                  {portfolioSummary.alertsSummary.triggeredAlerts}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Allocation Chart */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Asset Allocation</h3>
          <div className="flex justify-center">
            <PieChart width={300} height={300}>
              <Pie
                data={assetAllocationData}
                cx={150}
                cy={150}
                labelLine={false}
                outerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {assetAllocationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => formatCurrency(value)}
              />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Investment Stats */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Investment Statistics</h3>
        <p className="text-gray-600">
          Total Investments: <span className="font-bold">{portfolioSummary.totalInvestments}</span>
        </p>
      </div>
    </div>
  );
};

export default PortfolioSummary;