import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  familyGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'FamilyGroup', required: true },
  deadline: { type: Date },
  status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  icon: { type: String, default: 'Target' }, // For UI customization
  contributions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
