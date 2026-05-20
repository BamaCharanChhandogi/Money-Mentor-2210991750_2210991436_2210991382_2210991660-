import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Building, CreditCard, RefreshCw, Loader2, Check, AlertTriangle, Building2, Trash2 } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../../api';

const plaidApi = {
  createLinkToken: async () => {
    const res = await axios.post(`${BASE_URL}/plaid/create-link-token`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data.link_token;
  },

  exchangePublicToken: async (publicToken) => {
    const res = await axios.post(`${BASE_URL}/plaid/exchange-public-token`, { public_token: publicToken }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data.accounts;
  },

  getAccounts: async () => {
    const res = await axios.get(`${BASE_URL}/plaid/accounts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data;
  },

  syncTransactions: async (accountId) => {
    const res = await axios.post(`${BASE_URL}/plaid/sync-transactions/${accountId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data.transactions;
  },

  deleteAccount: async (accountId) => {
    console.log('plaidApi: Requesting delete for', accountId);
    const res = await axios.delete(`${BASE_URL}/plaid/accounts/${accountId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data;
  }
};

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 ease-in-out 
      ${type === 'error'
        ? 'bg-red-600 text-white border-2 border-red-700'
        : 'bg-success-600 text-white border-2 border-success-700'
      } flex items-center space-x-3 scale-in`}>
      {type === 'error' ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Check className="h-5 w-5" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

const PlaidLinkButton = ({ onSuccess, onExit }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLinkToken = async () => {
      try {
        const token = await plaidApi.createLinkToken();
        setLinkToken(token);
      } catch (err) {
        setError(err.message);
      }
    };
    getLinkToken();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      onSuccess(public_token, metadata);
    },
    onExit: (err, metadata) => {
      onExit(err, metadata);
    },
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="btn-primary w-full py-4 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-500/25"
    >
      <Building className="h-5 w-5" />
      <span>Connect Bank Account</span>
    </button>
  );
};

const AccountCard = ({ account, onSync, onDelete }) => {
  const [syncing, setSyncing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSync = (e) => {
    e.stopPropagation();
    setSyncing(true);
    onSync(account._id).finally(() => setSyncing(false));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000); // 3-second window
      return;
    }

    setDeleting(true);
    onDelete(account._id)
      .catch(err => console.error('Delete failed:', err))
      .finally(() => {
        setDeleting(false);
        setShowConfirm(false);
      });
  };

  return (
    <div className={`glass-card p-6 transition-all duration-300 ${deleting ? 'opacity-50 grayscale' : 'hover:shadow-2xl hover:-translate-y-1'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-lg">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{account.accountName}</h3>
            <p className="text-sm text-slate-500 capitalize">
              {account.accountType} • {account.accountSubtype}
            </p>
            {account.lastUpdated && (
              <p className="text-[10px] text-slate-400 mt-1">
                Last synced: {new Date(account.lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right mr-4">
            <p className="text-2xl font-bold text-slate-900">
              ${account.balance?.current?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Current Balance</p>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="p-2.5 rounded-lg bg-primary-50 hover:bg-primary-100 transition-all duration-300 focus:outline-none"
              onClick={handleSync}
              disabled={syncing || deleting}
              title="Sync Transactions"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 text-primary-600 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 text-primary-600" />
              )}
            </button>
            <button
              className={`p-2.5 rounded-lg transition-all duration-300 focus:outline-none flex items-center gap-2 ${showConfirm ? 'bg-red-600 text-white w-auto px-4' : 'bg-red-50 text-red-600'
                }`}
              onClick={handleDelete}
              disabled={syncing || deleting}
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : showConfirm ? (
                <>
                  <Trash2 className="h-4 w-4" />
                  <span className="text-xs font-bold whitespace-nowrap">Click again to confirm</span>
                </>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountList = ({ accounts, onSync, onDelete }) => {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-16 glass-card">
        <div className="inline-flex p-4 bg-primary-100 rounded-2xl mb-4">
          <CreditCard className="h-10 w-10 text-primary-600" />
        </div>
        <p className="text-lg font-semibold text-slate-900 mb-2">No connected accounts found</p>
        <p className="text-sm text-slate-500">Connect a bank account to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <AccountCard
          key={account._id}
          account={account}
          onSync={onSync}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const PlaidIntegration = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchAccounts = useCallback(async () => {
    try {
      const fetchedAccounts = await plaidApi.getAccounts();
      setAccounts(fetchedAccounts);
    } catch (error) {
      setToastMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handlePlaidSuccess = async (publicToken, metadata) => {
    setLoading(true);
    try {
      const newAccounts = await plaidApi.exchangePublicToken(publicToken);
      await fetchAccounts();
      setToastMessage({ text: "Bank account connected successfully", type: "success" });
    } catch (error) {
      setToastMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaidExit = (err, metadata) => {
    if (err) {
      setToastMessage({ text: err.message, type: "error" });
    }
  };

  const handleSync = async (accountId) => {
    try {
      await plaidApi.syncTransactions(accountId);
      setToastMessage({ text: "Transactions synchronized successfully", type: "success" });
      await fetchAccounts();
    } catch (error) {
      setToastMessage({ text: error.message, type: "error" });
    }
  };

  const handleDeleteAccount = async (accountId) => {
    console.log('PlaidIntegration: handleDeleteAccount for', accountId);
    try {
      const result = await plaidApi.deleteAccount(accountId);
      console.log('PlaidIntegration: Delete result', result);
      setToastMessage({ text: "Account disconnected successfully", type: "success" });
      await fetchAccounts();
    } catch (error) {
      console.error('PlaidIntegration: Delete error', error);
      setToastMessage({ text: error.message, type: "error" });
    }
  };

  return (
    <div className="min-h-screen bg-mesh py-8">
      <div className="container mx-auto px-4 lg:px-8 space-y-8">
        {toastMessage && (
          <Toast
            message={toastMessage.text}
            type={toastMessage.type}
            onClose={() => setToastMessage(null)}
          />
        )}

        {/* Header */}
        <div className="glass-card p-6 shadow-xl fade-in-up">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Bank Accounts</h1>
              <p className="text-slate-600">Securely connect and manage your bank accounts</p>
            </div>
          </div>
        </div>

        {/* Connect Button */}
        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <PlaidLinkButton
            onSuccess={handlePlaidSuccess}
            onExit={handlePlaidExit}
          />
        </div>

        {/* Accounts List */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          {loading ? (
            <div className="flex justify-center items-center p-16 glass-card">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Loading accounts...</p>
              </div>
            </div>
          ) : (
            <AccountList
              accounts={accounts}
              onSync={handleSync}
              onDelete={handleDeleteAccount}
            />
          )}
        </div>

        {/* Info Section */}
        <div className="glass-card p-6 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Why connect your bank?</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Auto-sync", desc: "Transactions imported automatically" },
              { title: "Secure", desc: "Bank-level 256-bit encryption" },
              { title: "Real-time", desc: "Up-to-date balance information" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <div className="p-2 bg-success-100 rounded-lg">
                  <Check className="h-4 w-4 text-success-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaidIntegration;