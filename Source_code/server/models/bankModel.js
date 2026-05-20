import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plaidAccountId: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  institutionId: String,
  institutionName: String,
  accountName: String,
  accountType: String,
  accountSubtype: String,
  balance: {
    available: Number,
    current: Number,
    limit: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Account = mongoose.model('Account', AccountSchema);
export default Account;