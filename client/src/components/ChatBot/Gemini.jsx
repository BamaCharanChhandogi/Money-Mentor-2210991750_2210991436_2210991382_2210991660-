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
        style={{
          background: isOpen ? '#2c2a20' : 'linear-gradient(135deg, #c9a84c 0%, #2c2a20 100%)',
          transform: isOpen ? 'rotate(90deg) scale(0.9)' : undefined,
        }}
        className="group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-105"
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white transition-transform" style={{ color: '#e8dfc0' }} />
        ) : (
          <MessageCircle className="w-8 h-8 group-hover:rotate-6 transition-transform" style={{ color: '#e8dfc0' }} />
        )}

        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#c9a84c' }}></span>
            <span className="relative inline-flex rounded-full h-5 w-5 border-2 border-white" style={{ background: '#8a6e2a' }}></span>
          </span>
        )}
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[600px] max-h-[80vh] backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up origin-bottom-right" style={{ background: '#faf7f0', border: '1px solid rgba(201,168,76,0.25)' }}>
          {/* Header */}
          <div className="p-4 pb-12 shadow-lg relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2c2a20 0%, #3e3c28 100%)' }}>
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'rgba(201,168,76,0.08)' }}></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg backdrop-blur-md" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.25)' }}>
                  <Bot className="w-6 h-6" style={{ color: '#c9a84c' }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: '#e8dfc0' }}>Money Mentor AI</h3>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#c9a84c' }}></span>
                    <span className="text-xs font-medium" style={{ color: '#9a9070' }}>Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 transition-colors"
                style={{ color: '#9a9070' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.15)'; e.currentTarget.style.color = '#c9a84c'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9a9070'; }}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container (Lifted up to overlap header) */}
          <div className="flex-1 -mt-6 rounded-t-3xl overflow-hidden flex flex-col relative z-20" style={{ background: '#f5f0e8' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-2 shadow-sm mt-1" style={{ background: 'linear-gradient(135deg, #c9a84c, #2c2a20)' }}>
                      <Sparkles className="w-4 h-4" style={{ color: '#e8dfc0' }} />
                    </div>
                  )}

                  <div
                    className="max-w-[80%] px-5 py-3.5 text-sm leading-relaxed shadow-sm"
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #2c2a20, #3e3c28)', color: '#e8dfc0', borderRadius: '1rem', borderTopRightRadius: '0.25rem' }
                      : { background: 'rgba(255,255,255,0.75)', color: '#1a1810', borderRadius: '1rem', borderTopLeftRadius: '0.25rem', border: '1px solid rgba(201,168,76,0.2)' }
                    }
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ml-2 shadow-sm mt-1" style={{ background: '#e8e0cc' }}>
                      <User className="w-4 h-4" style={{ color: '#6b6448' }} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mr-2 shadow-sm" style={{ background: 'linear-gradient(135deg, #c9a84c, #2c2a20)' }}>
                    <Sparkles className="w-4 h-4" style={{ color: '#e8dfc0' }} />
                  </div>
                  <div className="px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex space-x-1.5 items-center" style={{ background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#c9a84c', animationDelay: '0s' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#c9a84c', animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#c9a84c', animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4" style={{ background: '#faf7f0', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
            <div
              className="flex items-center space-x-2 p-1.5 rounded-full transition-all"
              style={{ background: '#f0ece0', border: '1.5px solid #d8d0b8' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.15)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = '#d8d0b8'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask for advice..."
                className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
                style={{ color: '#1a1810' }}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
                style={{
                  background: isLoading || !input.trim() ? '#d8d0b8' : 'linear-gradient(135deg, #c9a84c, #2c2a20)',
                  cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" style={{ color: '#8a7f60' }} />
                ) : (
                  <Send className="w-5 h-5 ml-0.5" style={{ color: '#e8dfc0' }} />
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