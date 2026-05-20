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

  const COLORS = ['#2A2925', '#9B7D6B', '#C9A24A', '#B8745C', '#6B8E5A'];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F0D8', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Breadcrumb */}
        <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '2rem', color: '#7A7A73', letterSpacing: '0.1em' }}>
          SERVICES › INVESTMENTS
        </p>

        {/* Header Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', fontWeight: '800', marginBottom: '1.5rem', color: '#2A2925', fontFamily: 'Georgia, serif' }}>
            Investment <span style={{ color: '#9B7D6B', fontStyle: 'italic' }}>portfolio.</span>
          </h1>
          <p style={{ fontSize: '1rem', maxWidth: '42rem', color: '#57564F', lineHeight: '1.6' }}>
            Track stocks, crypto, ETFs, and bonds in one place. Monitor your performance, asset allocation, and build wealth with confidence.
          </p>
        </div>

        {/* Update Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button
            onClick={handleUpdatePrices}
            disabled={isUpdatePricesLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#2A2925',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              cursor: isUpdatePricesLoading ? 'not-allowed' : 'pointer',
              opacity: isUpdatePricesLoading ? 0.5 : 1,
            }}
          >
            {isUpdatePricesLoading ? (
              <>
                <div style={{ animation: 'spin 1s linear infinite', width: '1.25rem', height: '1.25rem', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <RefreshCw style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>Update Prices</span>
              </>
            )}
          </button>
        </div>

        {/* Portfolio Overview */}
        {portfolioSummary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Total Portfolio Value Card */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '1rem', border: '1px solid #E0D5C8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: '#F8F3CE', padding: '0.75rem', borderRadius: '0.75rem' }}>
                    <DollarSign style={{ width: '1.5rem', height: '1.5rem', color: '#2A2925' }} />
                  </div>
                  <span style={{ backgroundColor: '#F8F3CE', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: '#2A2925' }}>+5.2%</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#7A7A73', display: 'block', marginBottom: '0.75rem' }}>Total Portfolio Value</span>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#2A2925', fontFamily: 'Georgia, serif' }}>
                  ${portfolioSummary.performanceSummary.totalValue?.toFixed(2)}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E0D5C8', fontSize: '0.75rem', color: '#7A7A73' }}>
                <ArrowUpRight style={{ width: '1rem', height: '1rem', marginRight: '0.25rem', color: '#6B8E5A' }} />
                <span>This month</span>
              </div>
            </div>

            {/* Total Return Card */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '1rem', border: '1px solid #E0D5C8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: portfolioSummary.performanceSummary.overallReturn > 0 ? '#F8F3CE' : '#F4F0D8', padding: '0.75rem', borderRadius: '0.75rem' }}>
                    {portfolioSummary.performanceSummary.overallReturn > 0 ? (
                      <TrendingUp style={{ width: '1.5rem', height: '1.5rem', color: '#6B8E5A' }} />
                    ) : (
                      <TrendingDown style={{ width: '1.5rem', height: '1.5rem', color: '#B8745C' }} />
                    )}
                  </div>
                  <span style={{ backgroundColor: portfolioSummary.performanceSummary.overallReturn > 0 ? '#F8F3CE' : '#F4F0D8', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '700', color: portfolioSummary.performanceSummary.overallReturn > 0 ? '#6B8E5A' : '#B8745C' }}>
                    {portfolioSummary.performanceSummary.overallReturn > 0 ? 'Positive' : 'Negative'}
                  </span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#7A7A73', display: 'block', marginBottom: '0.75rem' }}>Total Return</span>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: portfolioSummary.performanceSummary.overallReturn > 0 ? '#6B8E5A' : '#B8745C', fontFamily: 'Georgia, serif' }}>
                  {portfolioSummary.performanceSummary.overallReturn?.toFixed(2)}%
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E0D5C8', fontSize: '0.75rem', color: '#7A7A73' }}>
                <Info style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                <span>Since inception</span>
              </div>
            </div>

            {/* Asset Allocation Card */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '1rem', border: '1px solid #E0D5C8', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: '#2A2925', margin: 0, fontFamily: 'Georgia, serif' }}>Asset Allocation</h3>
                <div style={{ backgroundColor: '#F8F3CE', padding: '0.5rem', borderRadius: '0.75rem' }}>
                  <PieChartIcon style={{ width: '1.5rem', height: '1.5rem', color: '#2A2925' }} />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
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
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '1rem', border: '1px solid #E0D5C8' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#2A2925', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Georgia, serif' }}>
            <PlusCircle style={{ width: '1.5rem', height: '1.5rem', color: '#2A2925' }} />
            Add New Investment
          </h2>
          <form onSubmit={handleAddInvestment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#57564F' }}>Symbol</label>
                <select
                  value={newInvestment.symbol}
                  onChange={(e) => setNewInvestment({ ...newInvestment, symbol: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#F4F0D8', border: '1px solid #E0D5C8', borderRadius: '0.5rem', color: '#2A2925', fontSize: '0.875rem' }}
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#57564F' }}>Name</label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#F4F0D8', border: '1px solid #E0D5C8', borderRadius: '0.5rem', color: '#2A2925', fontSize: '0.875rem' }}
                  placeholder="Investment name"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#57564F' }}>Type</label>
                <select
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#F4F0D8', border: '1px solid #E0D5C8', borderRadius: '0.5rem', color: '#2A2925', fontSize: '0.875rem' }}
                >
                  <option value="stock">Stock</option>
                  <option value="bond">Bond</option>
                  <option value="etf">ETF</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#57564F' }}>Quantity</label>
                <input
                  type="number"
                  value={newInvestment.quantity}
                  onChange={(e) => setNewInvestment({ ...newInvestment, quantity: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#F4F0D8', border: '1px solid #E0D5C8', borderRadius: '0.5rem', color: '#2A2925', fontSize: '0.875rem' }}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#57564F' }}>Purchase Price</label>
                <input
                  type="number"
                  value={newInvestment.purchasePrice}
                  onChange={(e) => setNewInvestment({ ...newInvestment, purchasePrice: parseFloat(e.target.value) })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#F4F0D8', border: '1px solid #E0D5C8', borderRadius: '0.5rem', color: '#2A2925', fontSize: '0.875rem' }}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: '#57564F' }}>Purchase Date</label>
                <input
                  type="date"
                  value={newInvestment.purchaseDate}
                  onChange={(e) => setNewInvestment({ ...newInvestment, purchaseDate: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#F4F0D8', border: '1px solid #E0D5C8', borderRadius: '0.5rem', color: '#2A2925', fontSize: '0.875rem' }}
                  required
                />
              </div>
            </div>

            <button type="submit" style={{ backgroundColor: '#2A2925', color: '#FFFFFF', padding: '0.75rem 2rem', borderRadius: '0.75rem', border: 'none', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' }}>
              Add Investment
            </button>
          </form>
        </div>

        {/* Investments Table */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '2rem', borderRadius: '1rem', border: '1px solid #E0D5C8', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#2A2925', fontFamily: 'Georgia, serif' }}>
            Current Investments
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8F3CE', borderBottom: '1px solid #E0D5C8' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Symbol</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Quantity</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Purchase</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Current</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Total Value</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '700', color: '#7A7A73', textTransform: 'uppercase' }}>Return</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => {
                  const returnPercent = ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) * 100;
                  const isPositive = returnPercent > 0;
                  return (
                    <tr key={investment._id} style={{ borderBottom: '1px solid #E0D5C8', transition: 'background-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F3CE'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '1rem', fontWeight: '600', color: '#2A2925' }}>{investment.symbol}</td>
                      <td style={{ padding: '1rem', color: '#7A7A73' }}>{investment.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ paddingX: '0.5rem', paddingY: '0.25rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '500', backgroundColor: '#F8F3CE', color: '#2A2925' }}>
                          {investment.type}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#7A7A73' }}>{investment.quantity}</td>
                      <td style={{ padding: '1rem', color: '#7A7A73' }}>${investment.purchasePrice.toFixed(2)}</td>
                      <td style={{ padding: '1rem', color: '#2A2925', fontWeight: '600' }}>${investment.currentPrice.toFixed(2)}</td>
                      <td style={{ padding: '1rem', color: '#2A2925', fontWeight: 'bold' }}>
                        ${(investment.quantity * investment.currentPrice).toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', paddingX: '0.5rem', paddingY: '0.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', backgroundColor: isPositive ? '#F8F3CE' : '#F4F0D8', color: isPositive ? '#6B8E5A' : '#B8745C' }}>
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

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default InvestmentTracker;