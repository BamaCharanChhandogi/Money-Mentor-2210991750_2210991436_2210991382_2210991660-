import mongoose from 'mongoose';
const TransactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    // required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plaidTransactionId: {
    type: String,
    // required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  name: String,
  merchantName: String,
  category: [String],
  pending: Boolean,
  paymentChannel: String,
  location: {
    address: String,
    city: String,
    region: String,
    postalCode: String,
    country: String,
    lat: Number,
    lon: Number
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;