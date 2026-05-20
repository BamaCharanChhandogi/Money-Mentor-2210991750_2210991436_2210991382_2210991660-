import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../api';
import {
  Loader2,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Target
} from 'lucide-react';

const FinancialAdvice = () => {
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdvice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/financial-advice/ai-advice`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate advice. Please try again later.');
      }

      const data = await response.json();
      if (!data.advice) {
        throw new Error('No advice received from the system.');
      }

      setAdvice(data.advice);
    } catch (error) {
      console.error('Error fetching advice:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  // Safer format function that returns an array of React elements instead of HTML string
  const renderFormattedAdvice = (text) => {
    if (!text) return null;

    // Split by newlines first
    const lines = text.split('\n');

    return lines.map((line, index) => {
      // Process bold text (**text**)
      const parts = line.split(/(\*\*.*?\*\*)/g);

      const formattedLine = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={partIndex} className="font-bold text-slate-800">
              {part.slice(2, -2)}
            </span>
          );
        }
        // Process Italic (*text*)
        const italicParts = part.split(/(\*.*?\*)/g);
        return italicParts.map((subPart, subIndex) => {
          if (subPart.startsWith('*') && subPart.endsWith('*') && !subPart.startsWith('**')) {
            return <em key={`${partIndex}-${subIndex}`} className="italic text-slate-600">{subPart.slice(1, -1)}</em>;
          }
          return subPart;
        });
      });

      if (line.trim().length === 0) return <br key={index} />;

      // Check if line is a bullet point
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return (
          <div key={index} className="flex items-start space-x-2 my-2 pl-4">
            <div className="min-w-[6px] h-[6px] rounded-full bg-primary-500 mt-2"></div>
            <p className="text-slate-600 leading-relaxed">{formattedLine}</p>
          </div>
        )
      }

      // Check if line looks like a header (short, bold, or numbered)
      if (line.match(/^\d+\./) || (line.length < 50 && line.includes('**'))) {
        return <h3 key={index} className="text-lg font-semibold text-slate-800 mt-6 mb-3">{formattedLine}</h3>;
      }

      return (
        <p key={index} className="text-slate-600 leading-relaxed mb-4">
          {formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-mesh py-12">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <div className="inline-flex p-4 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            AI Financial Advisor
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get personalized financial insights and actionable advice powered by advanced AI
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card min-h-[400px] relative overflow-hidden fade-in-up" style={{ animationDelay: '0.1s' }}>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-24 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary-100 rounded-full animate-spin border-t-primary-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Analyzing your finances...</h3>
                <p className="text-slate-500">Our AI is generating personalized advice for you</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-20 px-4 text-center">
              <div className="p-4 bg-red-50 rounded-full mb-6">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Analysis Failed</h3>
              <p className="text-slate-600 max-w-md mb-8">
                {error}
              </p>
              <button
                onClick={fetchAdvice}
                className="btn-primary flex items-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            </div>
          ) : (
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    Your Personalized Insights
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Generated based on your recent financial data</p>
                </div>
                <button
                  onClick={fetchAdvice}
                  className="p-3 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
                  title="Regenerate Advice"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="prose prose-lg prose-slate max-w-none">
                {renderFormattedAdvice(advice)}
              </div>

              {/* Action Items Footer */}
              <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  Recommended Actions
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Review Budget</h4>
                      <p className="text-sm text-slate-500">Check your monthly limits</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Track Expenses</h4>
                      <p className="text-sm text-slate-500">Log recent transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAdvice;
