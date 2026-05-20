import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  ChevronDown,
  List,
  Grid,
  MoreHorizontal,
  ArrowUpDown,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  X
} from 'lucide-react';
import { BASE_URL } from '../api';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'desc'
  });

  // Lock body scroll when modal is open - FIXED UX ISSUE
  useEffect(() => {
    if (selectedTransaction) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [selectedTransaction]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/transactions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTransactions(response.data);

        const uniqueCategories = ['All', ...new Set(
          response.data
            .map(t => t.category?.[0] || 'Uncategorized')
            .filter(Boolean)
        )];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];
    if (selectedCategory !== 'All') {
      result = result.filter(t =>
        (t.category?.[0] || 'Uncategorized') === selectedCategory
      );
    }

    result.sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTransactions(result);
  }, [selectedCategory, transactions, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));
  };

  // Modal Component using Portal
  const TransactionModal = () => {
    if (!selectedTransaction) return null;

    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" style={{ margin: 0, padding: '1rem' }}>
        <div
          className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          onClick={() => setSelectedTransaction(null)}
        ></div>
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl scale-in overflow-hidden max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <h2 className="text-xl font-display font-bold text-slate-900">Transaction Details</h2>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${selectedTransaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                {selectedTransaction.amount > 0 ? (
                  <ArrowUpRight className="h-8 w-8 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-8 w-8 text-red-600" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{selectedTransaction.name}</h3>
              <p className={`text-3xl font-bold mt-2 ${selectedTransaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {selectedTransaction.amount > 0 ? '+' : ''}{formatCurrency(selectedTransaction.amount)}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 text-sm font-medium">Merchant</span>
                <span className="font-semibold text-slate-900">{selectedTransaction.merchantName || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-slate-500 text-sm font-medium">Date</span>
                <span className="font-semibold text-slate-900">{new Date(selectedTransaction.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 text-sm font-medium">Category</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                  {selectedTransaction.category?.[0] || 'Uncategorized'}
                </span>
              </div>
              {selectedTransaction.location && (
                <div className="flex justify-between py-2 border-t border-slate-200 pt-3">
                  <span className="text-slate-500 text-sm font-medium">Location</span>
                  <span className="font-semibold text-slate-900 text-right text-sm">
                    {selectedTransaction.location.city}, {selectedTransaction.location.region}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-48 pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none appearance-none cursor-pointer"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none h-4 w-4" />
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Grid size={18} />
              </button>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            Showing <span className="text-slate-900 font-bold">{filteredTransactions.length}</span> transactions
          </div>
        </div>

        {viewMode === 'table' && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    {['Date', 'Name', 'Merchant', 'Amount', 'Category'].map((header) => (
                      <th
                        key={header}
                        className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => handleSort(header.toLowerCase())}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header}</span>
                          <ArrowUpDown size={14} className="text-slate-400" />
                        </div>
                      </th>
                    ))}
                    <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction._id} className="group hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                              <Calendar size={14} />
                            </div>
                            <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-semibold text-slate-900">{transaction.name}</td>
                        <td className="p-4 text-sm text-slate-500">{transaction.merchantName || '—'}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-sm font-bold ${transaction.amount > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                            }`}>
                            {transaction.amount > 0 ? (
                              <ArrowUpRight size={14} />
                            ) : (
                              <ArrowDownRight size={14} />
                            )}
                            <span>{formatCurrency(transaction.amount)}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {transaction.category?.[0] || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-primary-600 bg-white hover:bg-primary-50 border border-slate-200 hover:border-primary-200 rounded-lg transition-all"
                            onClick={() => openTransactionDetails(transaction)}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="p-4 rounded-full bg-slate-50">
                            <Search className="h-8 w-8 text-slate-300" />
                          </div>
                          <p>No transactions found matching your filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTransactions.map(transaction => (
              <div
                key={transaction._id}
                className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-200 transition-all duration-300 cursor-pointer"
                onClick={() => openTransactionDetails(transaction)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
                    <Calendar size={14} />
                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                  </div>
                  <button className="text-slate-400 hover:text-primary-600">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{transaction.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{transaction.merchantName || '—'}</p>

                <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                  <span className={`flex items-center space-x-1 text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
                    {transaction.category?.[0] || 'General'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal rendered via Portal - NOW PROPERLY CENTERED! */}
      <TransactionModal />
    </>
  );
};

export default TransactionsList;