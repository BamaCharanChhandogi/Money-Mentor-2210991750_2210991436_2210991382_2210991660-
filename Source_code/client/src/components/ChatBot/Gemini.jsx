import React, { useState, useRef, useEffect } from 'react';
import { BASE_URL } from '../../api';
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  RefreshCw,
  Bot,
  User,
  ChevronDown
} from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I\'m your personal Money Mentor. Ask me about your budget, investment tips, or saving strategies!' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/financial-chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = {
        role: 'bot',
        content: data.response || 'I apologize, but I couldn\'t process your request.',
        type: data.type || 'default'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        content: 'I seem to be having trouble connecting. Please check your internet connection and try again.',
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] font-sans">
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center
          ${isOpen ? 'bg-slate-900 rotate-90 scale-90' : 'bg-gradient-to-br from-emerald-500 to-primary-600 hover:scale-105'}
        `}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white transition-transform" />
        ) : (
          <MessageCircle className="w-8 h-8 text-white group-hover:rotate-6 transition-transform" />
        )}

        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[600px] max-h-[80vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-slide-up origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-primary-600 p-4 pb-12 shadow-lg relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-fullblur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Money Mentor AI</h3>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-white/80 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1.5 transition-colors text-white/80 hover:text-white"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container (Lifted up to overlap header) */}
          <div className="flex-1 -mt-6 bg-slate-50 rounded-t-3xl overflow-hidden flex flex-col relative z-20">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-primary-600 flex items-center justify-center shrink-0 mr-2 shadow-sm mt-1">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`
                        max-w-[80%] px-5 py-3.5 text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user'
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-tr-sm'
                        : 'bg-white text-slate-700 rounded-2xl rounded-tl-sm border border-slate-100'}
                      `}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 ml-2 shadow-sm mt-1">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-primary-600 flex items-center justify-center shrink-0 mr-2 shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex space-x-1.5 items-center">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for advice..."
                className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className={`
                  p-2.5 rounded-full text-white transition-all duration-300 shadow-md
                  ${isLoading || !input.trim()
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-primary-600 hover:shadow-lg hover:scale-105 active:scale-95'}
                `}
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 ml-0.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;