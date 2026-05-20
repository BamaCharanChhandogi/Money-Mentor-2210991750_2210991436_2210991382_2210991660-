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
    discreetMode: true,
  });

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="px-8 py-3 rounded-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: '#2A2925' }}
      data-plaid-connect
    >
      + Connect bank
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
      setTimeout(() => setShowConfirm(false), 3000);
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

  const colors = ['#2A2925', '#B8745C', '#9B7D6B', '#C9A24A', '#57564F', '#6B8E5A'];
  const colorIndex = Math.abs(account._id.charCodeAt(0)) % colors.length;
  const bgColor = colors[colorIndex];
  const textColor = '#FFFFFF';

  return (
    <div
      className={`p-6 rounded-2xl transition-all duration-300 hover:shadow-xl ${deleting ? 'opacity-50 grayscale' : ''}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
            {account.accountName[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold">{account.accountName}</h3>
            <p className="text-xs opacity-80 capitalize">{account.accountSubtype} · {account.accountType}</p>
            {account.lastUpdated && (
              <p className="text-[10px] opacity-60 mt-1">
                Synced {new Date(account.lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="p-2 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            onClick={handleSync}
            disabled={syncing || deleting}
            title="Sync"
          >
            {syncing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
          <button
            className="p-2 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            onClick={handleDelete}
            disabled={syncing || deleting}
            title="Delete"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-4xl font-bold mb-4">
        ${account.balance?.current?.toFixed(0)}<span style={{ fontSize: '18px' }}>.</span>{String(Math.round((account.balance?.current || 0) * 100) % 100).padStart(2, '0')}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-xs opacity-70">···· {String(account.mask || '0000').slice(-4)}</p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}></div>
          <p className="text-xs opacity-70">
            {account.lastUpdated ? `Synced ${new Date(account.lastUpdated).toLocaleString()}` : 'Not synced'}
          </p>
        </div>
      </div>
    </div>
  );
};

const AccountList = ({ accounts, onSync, onDelete }) => {
  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-16 p-8 rounded-2xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div className="inline-flex p-4 rounded-2xl mb-4" style={{ backgroundColor: '#F0E8DA' }}>
          <CreditCard className="h-10 w-10" style={{ color: '#2A2925' }} />
        </div>
        <p className="text-lg font-bold mb-2" style={{ color: '#2A2925' }}>No connected accounts found</p>
        <p className="text-sm" style={{ color: '#7A7A73' }}>Connect a bank account to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="min-h-screen" style={{ backgroundColor: '#F4F0D8' }}>
      <style>{`
        body { background-color: #F4F0D8; }
        .serif-title { font-family: Georgia, 'Times New Roman', serif; }
        .serif-italic { font-family: Georgia, 'Times New Roman', serif; font-style: italic; }
      `}</style>

      <div className="container mx-auto px-6 lg:px-12 py-8">
        {toastMessage && (
          <Toast
            message={toastMessage.text}
            type={toastMessage.type}
            onClose={() => setToastMessage(null)}
          />
        )}

        {/* Breadcrumb */}
        <p className="text-sm font-semibold mb-8" style={{ color: '#7A7A73', letterSpacing: '0.1em' }}>
          SERVICES › BANK ACCOUNTS
        </p>

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="serif-title text-5xl md:text-6xl font-bold mb-6" style={{ color: '#2A2925' }}>
            Banks & <span className="serif-italic" style={{ color: '#9B7D6B' }}>cards.</span>
          </h1>
          <p className="text-base max-w-2xl" style={{ color: '#57564F', lineHeight: '1.6' }}>
            Connect every account once, read-only — Money Mentor watches your balances, never moves a dollar. The vault stays with your bank.
          </p>
        </div>

        {/* Connect Another Account Banner */}
        <div className="p-8 rounded-2xl mb-12" style={{ backgroundColor: '#F8F3CE', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl flex-shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
                  <Building className="w-6 h-6" style={{ color: '#2A2925' }} />
                </div>
                <h3 className="font-bold text-xl lg:text-2xl" style={{ color: '#2A2925' }}>Connect another account.</h3>
              </div>
              <p className="text-sm lg:text-base leading-relaxed" style={{ color: '#57564F' }}>
                Add checking, savings, credit cards, or brokerages — 12,000+ institutions <span style={{ fontWeight: '600' }}>supported</span> · powered by Plaid · read-only · 60 seconds.
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-auto">
              <PlaidLinkButton
                onSuccess={handlePlaidSuccess}
                onExit={handlePlaidExit}
              />
            </div>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold mb-2" style={{ color: '#2A2925' }}>Connected accounts</h2>
            <p className="text-sm" style={{ color: '#7A7A73' }}>{accounts.length} active · 3 institutions · syncing automatically</p>
          </div>

          {/* Accounts Grid */}
          {loading ? (
            <div className="flex justify-center items-center p-16 rounded-2xl" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#2A2925' }} />
                <p style={{ color: '#57564F', fontWeight: '500' }}>Loading accounts...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((account) => (
                <AccountCard
                  key={account._id}
                  account={account}
                  onSync={handleSync}
                  onDelete={handleDeleteAccount}
                />
              ))}
              {/* Add Another Account Card */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('[data-plaid-connect]')?.click();
                }}
                className="p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all hover:shadow-lg"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '2px dashed #E0D5C8',
                  color: '#2A2925',
                  minHeight: '240px',
                  cursor: 'pointer'
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#57564F', color: '#FFFFFF' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>+</span>
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: '16px' }}>Add another account</h3>
                <p className="text-sm" style={{ color: '#7A7A73' }}>Connect via Plaid in under sixty seconds.</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaidIntegration;