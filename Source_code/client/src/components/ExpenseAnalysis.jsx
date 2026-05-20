import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api';

const ExpenseAnalysis = () => {
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/financial-advice/expense-analysis`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching expense analysis:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Expense Analysis</h1>
      {loading ? (
        <p>Loading expense analysis...</p>
      ) : analysis.length ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Total Expense</th>
            </tr>
          </thead>
          <tbody>
            {analysis.map((item, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                <td className="border border-gray-300 px-4 py-2">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expense analysis available.</p>
      )}
    </div>
  );
};

export default ExpenseAnalysis;
