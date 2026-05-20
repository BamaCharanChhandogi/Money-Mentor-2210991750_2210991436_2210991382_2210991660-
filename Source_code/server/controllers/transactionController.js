import Transaction from "../models/transactionModel.js";
import json2csv from 'json2csv';
import fs from 'fs';
import path from 'path';

export const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      userId: req.user._id,
    });
    
    await transaction.save();
    res.status(201).send(transaction);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
    });
    res.send(transactions);
  } catch (error) {
    res.status(500).send();
  }
};
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("bankAccount");
    if (!transaction) {
      return res.status(404).send();
    }
    res.send(transaction);
  } catch (error) {
    res.status(500).send();
  }
};
export const updateTransaction = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["category", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).send();
    }

    updates.forEach((update) => (transaction[update] = req.body[update]));
    await transaction.save();
    res.send(transaction);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const exportTransactions = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      category, 
      format = 'csv' 
    } = req.query;

    // Build query filter
    const filter = { userId: req.user._id };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Fetch transactions
    const transactions = await Transaction.find(filter);

    // Transform transactions for export
    const exportData = transactions.map(transaction => ({
      Date: transaction.date.toISOString().split('T')[0],
      Name: transaction.name,
      MerchantName: transaction.merchantName || 'N/A',
      Amount: transaction.amount,
      Category: transaction.category?.[0] || 'Uncategorized',
      PaymentChannel: transaction.paymentChannel || 'N/A',
      Location: transaction.location 
        ? `${transaction.location.address}, ${transaction.location.city}, ${transaction.location.region}` 
        : 'N/A'
    }));

    if (format === 'csv') {
      const fields = [
        'Date', 'Name', 'MerchantName', 'Amount', 
        'Category', 'PaymentChannel', 'Location'
      ];
      const json2csvParser = new json2csv.Parser({ fields });
      const csv = json2csvParser.parse(exportData);

      res.header('Content-Type', 'text/csv');
      res.attachment(`transactions_${new Date().toISOString().split('T')[0]}.csv`);
      return res.send(csv);
    } else if (format === 'json') {
      res.header('Content-Type', 'application/json');
      res.attachment(`transactions_${new Date().toISOString().split('T')[0]}.json`);
      return res.json(exportData);
    } else {
      return res.status(400).json({ message: 'Invalid export format' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting transactions' });
  }
};