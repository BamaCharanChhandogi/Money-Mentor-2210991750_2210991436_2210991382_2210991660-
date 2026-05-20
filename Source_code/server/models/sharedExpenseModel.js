// models/sharedExpenseModel.js
import mongoose from "mongoose";

const sharedExpenseSchema = new mongoose.Schema({
  familyGroup: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'FamilyGroup'
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  splitType: {
    type: String,
    enum: ['equal', 'percentage', 'custom'],
    default: 'equal'
  },
  splits: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'rejected'],
      default: 'pending'
    }
  }]
});

const SharedExpense = mongoose.model('SharedExpense', sharedExpenseSchema);

export default SharedExpense;