// server/services/plaidService.js
import  { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import Account from '../models/bankModel.js';
import Transaction from '../models/transactionModel.js';

class PlaidService {
  constructor() {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    });

    this.client = new PlaidApi(configuration);
  }

  async createLinkToken(userId) {
    try {
      const request = {
        user: { client_user_id: userId.toString() },
        client_name: 'Money Mentor',
        products: ['auth', 'transactions'],
        country_codes: ['US'],
        language: 'en',
      };

      const response = await this.client.linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw error;
    }
  }

  async exchangePublicToken(publicToken, userId) {
    try {
      const response = await this.client.itemPublicTokenExchange({
        public_token: publicToken
      });

      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;

      // Get account details
      const auth = await this.client.authGet({ access_token: accessToken });
      const accounts = auth.data.accounts;

      // Save accounts to database
      for (const plaidAccount of accounts) {
        const account = new Account({
          userId,
          plaidAccountId: plaidAccount.account_id,
          accessToken,
          itemId,
          accountName: plaidAccount.name,
          accountType: plaidAccount.type,
          accountSubtype: plaidAccount.subtype,
          balance: {
            available: plaidAccount.balances.available,
            current: plaidAccount.balances.current,
            limit: plaidAccount.balances.limit
          }
        });

        await account.save();
      }

      return accounts;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  }

  async syncTransactions(userId, accountId) {
    try {
      const account = await Account.findById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      const request = {
        access_token: account.accessToken,
        start_date: thirtyDaysAgo.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      };

      const response = await this.client.transactionsGet(request);
      const transactions = response.data.transactions;

      // Save transactions to database
      for (const plaidTransaction of transactions) {
        const transaction = new Transaction({
          accountId,
          userId,
          plaidTransactionId: plaidTransaction.transaction_id,
          amount: plaidTransaction.amount,
          date: new Date(plaidTransaction.date),
          name: plaidTransaction.name,
          merchantName: plaidTransaction.merchant_name,
          category: plaidTransaction.category,
          pending: plaidTransaction.pending,
          paymentChannel: plaidTransaction.payment_channel,
          location: {
            address: plaidTransaction.location.address,
            city: plaidTransaction.location.city,
            region: plaidTransaction.location.region,
            postalCode: plaidTransaction.location.postal_code,
            country: plaidTransaction.location.country,
            lat: plaidTransaction.location.lat,
            lon: plaidTransaction.location.lon
          }
        });

        await transaction.save();
      }

      return transactions;
    } catch (error) {
      console.error('Error syncing transactions:', error);
      throw error;
    }
  }

  async getAccountBalance(accountId) {
    try {
      const account = await Account.findById(accountId);
      if (!account) {
        throw new Error('Account not found');
      }

      const response = await this.client.accountsBalanceGet({
        access_token: account.accessToken,
      });

      const plaidAccount = response.data.accounts.find(
        acc => acc.account_id === account.plaidAccountId
      );

      if (plaidAccount) {
        account.balance = {
          available: plaidAccount.balances.available,
          current: plaidAccount.balances.current,
          limit: plaidAccount.balances.limit
        };
        account.lastUpdated = new Date();
        await account.save();
      }

      return account.balance;
    } catch (error) {
      console.error('Error getting account balance:', error);
      throw error;
    }
  }
  async getAllAccounts(userId) {
    try {
      const accounts = await Account.find({ userId });
      return accounts;
    } catch (error) {
      console.error('Error getting accounts:', error);
      throw error;
    }
  }

  async deleteAccount(userId, accountId) {
    try {
      const account = await Account.findOne({ _id: accountId, userId });
      if (!account) {
        throw new Error('Account not found');
      }

      // Delete associated transactions first
      await Transaction.deleteMany({ accountId });
      
      // Delete the account itself
      await Account.deleteOne({ _id: accountId });
      
      return { message: 'Account and associated transactions deleted successfully' };
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export const plaidService = new PlaidService();
