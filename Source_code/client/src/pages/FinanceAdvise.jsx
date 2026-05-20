import React, { useState } from 'react';
import ExpenseAnalysis from '../components/ExpenseAnalysis';
import BudgetAdherence from '../components/BudgetAdherence';
import FinancialAdvice from '../components/FinancialAdvice';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('advice');

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Financial Dashboard</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-6 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('advice')}
          className={`px-4 py-2 ${
            activeTab === 'advice'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Financial Advice
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 ${
            activeTab === 'expenses'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Expense Analysis
        </button>
        <button
          onClick={() => setActiveTab('adherence')}
          className={`px-4 py-2 ${
            activeTab === 'adherence'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500'
          }`}
        >
          Budget Adherence
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'advice' && <FinancialAdvice />}
        {activeTab === 'expenses' && <ExpenseAnalysis />}
        {activeTab === 'adherence' && <BudgetAdherence />}
      </div>
    </div>
  );
};

export default Dashboard;
