import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  keywords: [String],
  parentCategory: {
    type: String,
    default: null
  },
  systemGenerated: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
export default Category;