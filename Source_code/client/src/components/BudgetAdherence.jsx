import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api';

const BudgetAdherence = () => {
  const [adherence, setAdherence] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdherence = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/financial-advice/budget-adherence`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setAdherence(data);
    } catch (error) {
      console.error('Error fetching budget adherence:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdherence();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Budget Adherence</h1>
      {loading ? (
        <p>Loading budget adherence...</p>
      ) : adherence ? (
        <div>
          <p className="text-gray-700">Adherence: {adherence.percentage}%</p>
          <p className="text-gray-700">{adherence.message}</p>
        </div>
      ) : (
        <p>No data available for budget adherence.</p>
      )}
    </div>
  );
};

export default BudgetAdherence;
