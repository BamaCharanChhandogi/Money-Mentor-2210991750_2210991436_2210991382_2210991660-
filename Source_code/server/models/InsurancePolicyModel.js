import mongoose from 'mongoose';

const insurancePolicySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['life', 'health', 'auto', 'property']
  },
  provider: {
    type: String,
    required: true
  },
  policyNumber: {
    type: String,
    required: true
  },
  coverageAmount: {
    type: Number,
    required: true
  },
  premium: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  beneficiaries: [{
    name: String,
    relationship: String
  }]
});

const InsurancePolicy = mongoose.model('InsurancePolicy', insurancePolicySchema);

export default InsurancePolicy;