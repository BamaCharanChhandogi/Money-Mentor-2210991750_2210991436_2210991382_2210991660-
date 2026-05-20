import React, { useState } from 'react';
import axios from 'axios';
import { 
  Download, 
  FileText, 
  Table2, 
  CalendarDays, 
  Filter 
} from 'lucide-react';
import { BASE_URL } from '../../api';

const TransactionExport = () => {
  const [exportOptions, setExportOptions] = useState({
    startDate: '',
    endDate: '',
    category: 'All',
    format: 'csv'
  });
  const [categories, setCategories] = useState(['All', 'Food', 'Transport', 'Utilities']); // You can fetch these dynamically

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/transactions/export`, {
        params: exportOptions,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      });

      // Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `transactions_${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
      // Handle export error (show toast or error message)
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Download className="mr-2 text-blue-600" /> Export Transactions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <CalendarDays className="mr-2 text-blue-500" size={20} />
            Start Date
          </label>
          <input 
            type="date" 
            value={exportOptions.startDate}
            onChange={(e) => setExportOptions(prev => ({
              ...prev, 
              startDate: e.target.value
            }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <CalendarDays className="mr-2 text-blue-500" size={20} />
            End Date
          </label>
          <input 
            type="date" 
            value={exportOptions.endDate}
            onChange={(e) => setExportOptions(prev => ({
              ...prev, 
              endDate: e.target.value
            }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Filter className="mr-2 text-blue-500" size={20} />
            Category
          </label>
          <select 
            value={exportOptions.category}
            onChange={(e) => setExportOptions(prev => ({
              ...prev, 
              category: e.target.value
            }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <FileText className="mr-2 text-blue-500" size={20} />
            Export Format
          </label>
          <select 
            value={exportOptions.format}
            onChange={(e) => setExportOptions(prev => ({
              ...prev, 
              format: e.target.value
            }))}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-200"
          >
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleExport}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <Download className="mr-2" /> Export Transactions
        </button>
      </div>
    </div>
  );
};

export default TransactionExport;