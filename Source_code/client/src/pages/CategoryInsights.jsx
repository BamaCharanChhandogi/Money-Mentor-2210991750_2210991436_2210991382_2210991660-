import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { BASE_URL } from '../api';
import { Layers, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CategoryInsights = () => {
  const [categoryInsights, setCategoryInsights] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchCategoryInsights = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/insights`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCategoryInsights(response.data);
      } catch (error) {
        console.error('Error fetching category insights:', error);
      }
    };
    fetchCategoryInsights();
  }, []);

  // Format data for chart
const chartData = categoryInsights
  .map((insight) => {
    const {
      _id,
      totalSpend,
      transactionCount,
      averageTransactionAmount,
    } = insight;

    return {
      name: _id || "Uncategorized",
      totalSpend,
      transactionCount,
      averageAmount: averageTransactionAmount,
    };
  })
  .sort((a, b) => b.totalSpend - a.totalSpend);

  const totalSpend = chartData.reduce((sum, item) => sum + item.totalSpend, 0);

  // Color palette for bars
  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
      <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Layers className="mr-2" /> Spending Insights
            </h2>
            <p className="text-sm text-primary-100 mt-1">
              Detailed breakdown of your spending by category
            </p>
          </div>
          <div className="flex items-center">
            <TrendingUp className="mr-2" />
            <span className="text-2xl font-bold">
              ${totalSpend.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                label={{ value: 'Total Spend ($)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-primary-200">
                        <p className="font-bold text-slate-900 mb-2">{data.name}</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-primary-600 font-semibold">Total: ${data.totalSpend.toFixed(2)}</p>
                          <p className="text-slate-600">Transactions: {data.transactionCount}</p>
                          <p className="text-slate-600">Avg: ${data.averageAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="totalSpend"
                radius={[8, 8, 0, 0]}
                onMouseEnter={(data, index) => setHoveredIndex(index)}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hoveredIndex === index ? colors[index % colors.length] : `${colors[index % colors.length]}CC`}
                    style={{ transition: 'fill 0.3s ease' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Category Breakdown</h3>
          {chartData.map((category, index) => {
            const percentage = (category.totalSpend / totalSpend) * 100;
            return (
              <div
                key={category.name}
                className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="font-semibold text-slate-900">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">
                      ${category.totalSpend.toFixed(2)}
                    </span>
                    {percentage > 30 ? (
                      <ArrowUpRight className="text-red-500" size={16} />
                    ) : (
                      <ArrowDownRight className="text-green-500" size={16} />
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span className="font-medium">{percentage.toFixed(1)}%</span>
                  <span>{category.transactionCount} transactions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryInsights;