/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ExpenseForm = ({ expense, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date).toISOString().split('T')[0], // Format date for input
        description: expense.description || '',
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
        type="number"
        required
      />
      <Input
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <Input
        name="date"
        value={formData.date}
        onChange={handleChange}
        placeholder="Date"
        type="date"
        required
      />
      <Input
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <Button type="submit" onClick={handleSubmit}>Save Expense</Button>
      <Button type="button" onClick={onCancel} className="bg-gray-500">Cancel</Button>
    </form>
  );
};

export default ExpenseForm;
