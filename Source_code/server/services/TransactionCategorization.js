import natural from 'natural';
import stopword from 'stopword';
import Transaction from '../models/transactionModel.js';
import CategoryModel from '../models/CategorySchema.js'; // We'll create this model
import mongoose from 'mongoose';

class TransactionCategorizationService {
  constructor() {
    // Initialize Natural Language Processing tools
    this.tokenizer = new natural.WordTokenizer();
    this.classifier = new natural.BayesClassifier();
  }

  // Preprocess transaction text for better categorization
  preprocessText(text) {
    if (!text) return '';
    
    // Convert to lowercase
    let processedText = text.toLowerCase();
    
    // Remove special characters and numbers
    processedText = processedText.replace(/[^a-zA-Z\s]/g, '');
    
    // Tokenize
    let tokens = this.tokenizer.tokenize(processedText);
    
    // Remove stopwords
    tokens = stopword.removeStopwords(tokens);
    
    return tokens.join(' ');
  }

  // Train classifier based on existing categorized transactions
  async trainClassifier() {
    try {
      // Fetch categorized transactions
      const categorizedTransactions = await Transaction.aggregate([
        { $match: { 'category.0': { $exists: true } } },
        { $project: {
          text: { $concat: ['$name', ' ', '$merchantName'] },
          category: { $arrayElemAt: ['$category', 0] }
        }}
      ]);

      // Reset classifier
      this.classifier = new natural.BayesClassifier();

      // Train on existing data
      categorizedTransactions.forEach(transaction => {
        const processedText = this.preprocessText(transaction.text);
        if (processedText) {
          this.classifier.addDocument(processedText, transaction.category);
        }
      });

      // Train the classifier
      this.classifier.train();
    } catch (error) {
      console.error('Error training classifier:', error);
    }
  }

  // Predict category for a transaction
  predictCategory(transaction) {
    const text = `${transaction.name} ${transaction.merchantName}`;
    const processedText = this.preprocessText(text);
    
    try {
      // Use Plaid's original category as a starting point
      const plaidCategory = transaction.category && transaction.category[0];
      
      // Predict category
      const predictedCategory = this.classifier.classify(processedText);
      
      return {
        originalPlaidCategory: plaidCategory,
        aiPredictedCategory: predictedCategory,
        confidence: this.classifier.getClassifications(processedText)[0].value
      };
    } catch (error) {
      console.error('Error predicting category:', error);
      return {
        originalPlaidCategory: plaidCategory,
        aiPredictedCategory: 'Uncategorized',
        confidence: 0
      };
    }
  }

  // Bulk categorize transactions
  async bulkCategorizeTransactions(userId) {
    try {
      // Ensure classifier is trained
      await this.trainClassifier();

      // Find uncategorized transactions
      const uncategorizedTransactions = await Transaction.find({
        userId: userId,
        $or: [
          { 'category': { $size: 0 } },
          { 'category': { $exists: false } }
        ]
      });

      // Categorize transactions
      const categorizedTransactions = uncategorizedTransactions.map(transaction => {
        const categorization = this.predictCategory(transaction);
        
        return {
          updateOne: {
            filter: { _id: transaction._id },
            update: {
              $set: {
                category: [categorization.aiPredictedCategory],
                categorizationMetadata: {
                  originalPlaidCategory: categorization.originalPlaidCategory,
                  aiConfidence: categorization.confidence
                }
              }
            }
          }
        };
      });

      // Perform bulk write
      if (categorizedTransactions.length > 0) {
        await Transaction.bulkWrite(categorizedTransactions);
      }

      return categorizedTransactions;
    } catch (error) {
      console.error('Bulk categorization error:', error);
      throw error;
    }
  }

  // Create a custom category mapping
  async createCustomCategory(userId, categoryData) {
    try {
      const newCategory = new CategoryModel({
        userId: userId,
        name: categoryData.name,
        keywords: categoryData.keywords,
        parentCategory: categoryData.parentCategory
      });

      await newCategory.save();
      
      // Retrain classifier after adding new category
      await this.trainClassifier();

      return newCategory;
    } catch (error) {
      console.error('Error creating custom category:', error);
      throw error;
    }
  }

  // Advanced categorization with machine learning insights
  async generateCategoryInsights(userId) {
    try {
      const categoryInsights = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { 
          $group: {
            _id: { $arrayElemAt: ['$category', 0] },
            totalSpend: { $sum: '$amount' },
            transactionCount: { $sum: 1 },
            averageTransactionAmount: { $avg: '$amount' }
          }
        },
        { $sort: { totalSpend: -1 } }
      ]);

      return categoryInsights;
    } catch (error) {
      console.error('Error generating category insights:', error);
      throw error;
    }
  }
}

export const transactionCategorizationService = new TransactionCategorizationService();