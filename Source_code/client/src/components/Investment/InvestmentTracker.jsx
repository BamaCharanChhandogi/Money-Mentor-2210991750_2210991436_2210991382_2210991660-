import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { BASE_URL } from "../../api";
import { useSelector } from "react-redux";
import {
  PlusCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Wallet
} from "lucide-react";

const InvestmentTracker = () => {
  const [investments, setInvestments] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [newInvestment, setNewInvestment] = useState({
    symbol: "",
    name: "",
    type: "stock",
    quantity: 0,
    purchasePrice: 0,
    purchaseDate: "",
  });
  const [isUpdatePricesLoading, setIsUpdatePricesLoading] = useState(false);

  useEffect(() => {
    fetchInvestments();
    fetchPortfolioSummary();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvestments(response.data);
    } catch (error) {
      console.error("Error fetching investments", error);
    }
  };

  const fetchPortfolioSummary = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/investments/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolioSummary(response.data);
    } catch (error) {
      console.error("Error fetching portfolio summary", error);
    }
  };

  const handleAddInvestment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/investments`, newInvestment, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInvestments();
      fetchPortfolioSummary();
      setNewInvestment({
        symbol: "",
        name: "",
        type: "stock",
        quantity: 0,
        purchasePrice: 0,
        purchaseDate: "",
      });
    } catch (error) {
      console.error("Error adding investment", error);
    }
  };

  const handleUpdatePrices = async () => {
    setIsUpdatePricesLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/investments/update-prices`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchInvestments();
      await fetchPortfolioSummary();

      alert(`Updated ${response.data.updatedCount} investments successfully`);
    } catch (error) {
      console.error("Error updating prices:", error);
      alert(error.response?.data?.error || "Failed to update investment prices");
    } finally {
      setIsUpdatePricesLoading(false);
    }
  };

  const assetAllocationData = portfolioSummary
    ? Object.entries(portfolioSummary.assetAllocation).map(([name, value]) => ({
      name,
      value,
    }))
    : [];

  const COLORS = ['#C9A24A', '#57564F', '#6B8E5A', '#B8745C', '#8F6E2E'];

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        {/* Header */}
        <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl fade-in-up">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">
                Investment Portfolio
              </h1>
              <p className="text-slate-600">
                Track and manage your investments
              </p>
            </div>
          </div>
          <button
            onClick={handleUpdatePrices}
            disabled={isUpdatePricesLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 shadow-primary-500/25"
          >
            {isUpdatePricesLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Update Prices</span>
              </>
            )}
          </button>
        </div>

        {/* Portfolio Overview */}
        {portfolioSummary && (
          <div className="grid md:grid-cols-3 gap-6 fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-card-gradient bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <DollarSign className="text-white h-6 w-6" />
                </div>
                <TrendingUp className="w-6 h-6 text-white/80" />
              </div>
              <span className="text-sm font-medium text-white/80">Total Portfolio Value</span>
              <div className="text-4xl font-bold text-white mt-2">
                ${portfolioSummary.performanceSummary.totalValue?.toFixed(2)}
              </div>
              <div className="flex items-center mt-3 text-xs text-white/90">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span>+5.2% this month</span>
              </div>
            </div>

            <div className="stat-card-gradient bg-gradient-to-br from-success-500 to-success-700 p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  {portfolioSummary.performanceSummary.overallReturn > 0 ? (
                    <TrendingUp className="text-white h-6 w-6" />
                  ) : (
                    <TrendingDown className="text-white h-6 w-6" />
                  )}
                </div>
              </div>
              <span className="text-sm font-medium text-white/80">Total Return</span>
              <div className="text-4xl font-bold text-white mt-2">
                {portfolioSummary.performanceSummary.overallReturn?.toFixed(2)}%
              </div>
              <div className="flex items-center mt-3 text-xs text-white/90">
                <Info className="w-4 h-4 mr-1" />
                <span>Since inception</span>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900">Asset Allocation</h3>
                <PieChartIcon className="w-6 h-6 text-primary-500" />
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Add Investment Form */}
        <div className="glass-card p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-6 text-slate-900 flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-primary-600" />
            Add New Investment
          </h2>
          <form onSubmit={handleAddInvestment} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Symbol</label>
                <select
                  value={newInvestment.symbol}
                  onChange={(e) => setNewInvestment({ ...newInvestment, symbol: e.target.value })}
                  className="input-primary"
                  required
                >
                  <option value="">Select Symbol</option>
                  <optgroup label="Stocks">
                    <option value="AAPL">AAPL (Apple)</option>
                    <option value="MSFT">MSFT (Microsoft)</option>
                    <option value="GOOGL">GOOGL (Alphabet)</option>
                  </optgroup>
                  <optgroup label="Crypto">
                    <option value="BTC">BTC (Bitcoin)</option>
                    <option value="ETH">ETH (Ethereum)</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                  className="input-primary"
                  placeholder="Investment name"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Type</label>
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                  className="input-primary"
                >
                  <option value="stock">Stock</option>
                  <option value="bond">Bond</option>
                  <option value="etf">ETF</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Quantity</label>
                <input
                  type="number"
                  value={newInvestment.quantity}
                  onChange={(e) => setNewInvestment({ ...newInvestment, quantity: parseFloat(e.target.value) })}
                  className="input-primary"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Purchase Price</label>
                <input
                  type="number"
                  value={newInvestment.purchasePrice}
                  onChange={(e) => setNewInvestment({ ...newInvestment, purchasePrice: parseFloat(e.target.value) })}
                  className="input-primary"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Purchase Date</label>
                <input
                  type="date"
                  value={newInvestment.purchaseDate}
                  onChange={(e) => setNewInvestment({ ...newInvestment, purchaseDate: e.target.value })}
                  className="input-primary"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-success w-full md:w-auto px-8">
              Add Investment
            </button>
          </form>
        </div>

        {/* Investments Table */}
        <div className="glass-card p-8 overflow-x-auto fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold mb-6 text-slate-900">
            Current Investments
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Symbol</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Quantity</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Purchase</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Current</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Total Value</th>
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {investments.map((investment) => {
                  const returnPercent = ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
                  const isPositive = returnPercent > 0;
                  return (
                    <tr key={investment._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{investment.symbol}</td>
                      <td className="p-4 text-slate-600">{investment.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                          {investment.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{investment.quantity}</td>
                      <td className="p-4 text-slate-600">${investment.purchasePrice.toFixed(2)}</td>
                      <td className="p-4 text-slate-900 font-semibold">${investment.currentPrice.toFixed(2)}</td>
                      <td className="p-4 text-slate-900 font-bold">
                        ${(investment.quantity * investment.currentPrice).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-bold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          <span>{returnPercent.toFixed(2)}%</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentTracker;