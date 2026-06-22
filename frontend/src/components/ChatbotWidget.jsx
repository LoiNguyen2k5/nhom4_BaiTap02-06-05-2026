import { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { sendChatMessage } from '../services/chatbot.service';

// ================================
// Markdown-like renderer đơn giản
// ================================
const renderMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
};

// ================================
// Quick suggestion buttons
// ================================
const QUICK_ACTIONS_GUEST = [
  { label: '🧑‍💼 Tuyển dụng hiện tại', msg: 'Nhu cầu tuyển dụng của công ty hiện tại là gì?' },
  { label: '📋 Quy tắc công ty', msg: 'Quy tắc và nội quy làm việc tại công ty là gì?' },
  { label: '🎯 Yêu cầu nghiệp vụ', msg: 'Yêu cầu nghiệp vụ của công ty là gì?' },
  { label: '🔑 Reset mật khẩu', msg: 'Làm sao để reset mật khẩu?' },
];

const QUICK_ACTIONS_AUTH = [
  { label: '💰 Lương của tôi', msg: 'Lương tháng này của tôi là bao nhiêu?' },
  { label: '✅ Công việc hôm nay', msg: 'Công việc cần làm của tôi hôm nay là gì?' },
  { label: '📅 Xin nghỉ phép', msg: 'Xin nghỉ phép giúp tôi' },
  { label: '📊 Trạng thái đơn nghỉ', msg: 'Đơn xin nghỉ phép của tôi được duyệt chưa?' },
  { label: '🗓️ Số ngày phép còn lại', msg: 'Tháng này tôi đã nghỉ phép bao nhiêu ngày?' },
];

// ================================
// Typing indicator
// ================================
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
    <div style={{
      width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #1e3a6b, #2b4a85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px', boxShadow: '0 2px 8px rgba(30,58,107,0.3)'
    }}>🤖</div>
    <div style={{
      background: 'white', border: '1px solid #e1e5ec', borderRadius: '0 12px 12px 12px',
      padding: '10px 14px', display: 'flex', gap: '4px', alignItems: 'center',
      boxShadow: '0 1px 4px rgba(15,23,42,0.06)'
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#8fa4c7',
          animation: 'chatbotPulse 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  </div>
);

// ================================
// Single message bubble
// ================================
const MessageBubble = ({ msg }) => {
  const isBot = msg.role === 'bot';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '12px',
      flexDirection: isBot ? 'row' : 'row-reverse',
      animation: 'chatbotSlideIn 0.25s ease-out'
    }}>
      {isBot && (
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #1e3a6b, #2b4a85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', boxShadow: '0 2px 8px rgba(30,58,107,0.3)'
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '75%',
        background: isBot ? 'white' : 'linear-gradient(135deg, #1e3a6b, #2b4a85)',
        color: isBot ? '#3a4456' : 'white',
        border: isBot ? '1px solid #e1e5ec' : 'none',
        borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px',
        padding: '10px 14px',
        fontSize: '13.5px',
        lineHeight: '1.6',
        boxShadow: isBot ? '0 1px 4px rgba(15,23,42,0.06)' : '0 2px 8px rgba(30,58,107,0.25)',
      }}>
        {isBot ? (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
        ) : (
          <span>{msg.content}</span>
        )}
        <div style={{
          fontSize: '10.5px',
          opacity: 0.6,
          marginTop: '4px',
          textAlign: isBot ? 'left' : 'right'
        }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
};

// ================================
// MAIN WIDGET
// ================================
export default function ChatbotWidget() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = isAuthenticated
    ? [...QUICK_ACTIONS_GUEST, ...QUICK_ACTIONS_AUTH]
    : QUICK_ACTIONS_GUEST;

  // Tin nhắn chào mừng
  useEffect(() => {
    const greeting = isAuthenticated
      ? `Xin chào **${user?.name || 'bạn'}**! 👋 Tôi là trợ lý HR của công ty. Tôi có thể giúp bạn:\n\n💰 Xem lương · 📅 Xin nghỉ phép · ✅ Kiểm tra công việc · 📋 Tra cứu quy định\n\nBạn cần hỗ trợ gì hôm nay?`
      : `Xin chào! 👋 Tôi là trợ lý HR. Tôi có thể giúp bạn:\n\n🧑‍💼 Thông tin tuyển dụng · 📋 Quy tắc công ty · 🔑 Hỗ trợ mật khẩu\n\n*Đăng nhập để xem lương, công việc và quản lý nghỉ phép!*`;

    setMessages([{
      id: 1, role: 'bot', content: greeting,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }]);
  }, [isAuthenticated, user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input khi mở
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNewMsg(false);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMsg = {
      id: Date.now(), role: 'user', content: msg,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowQuickActions(false);

    try {
      const res = await sendChatMessage(msg);
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: res.reply || 'Xin lỗi, tôi không thể trả lời lúc này.',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      if (!isOpen) setHasNewMsg(true);
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'bot',
        content: '😔 Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    setShowQuickActions(true);
    const greeting = isAuthenticated
      ? `Xin chào **${user?.name || 'bạn'}**! 👋 Tôi là trợ lý HR của công ty. Tôi có thể giúp bạn:\n\n💰 Xem lương · 📅 Xin nghỉ phép · ✅ Kiểm tra công việc · 📋 Tra cứu quy định\n\nBạn cần hỗ trợ gì hôm nay?`
      : `Xin chào! 👋 Tôi là trợ lý HR. Tôi có thể giúp bạn:\n\n🧑‍💼 Thông tin tuyển dụng · 📋 Quy tắc công ty · 🔑 Hỗ trợ mật khẩu\n\n*Đăng nhập để xem lương, công việc và quản lý nghỉ phép!*`;
    setMessages([{
      id: Date.now(), role: 'bot', content: greeting,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <>
      {/* CSS keyframes */}
      <style>{`
        @keyframes chatbotPulse {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes chatbotSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatbotBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes chatbotSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatbotBadgePop {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .chatbot-quick-btn:hover {
          background: #dce4f2 !important;
          border-color: #3b5ba0 !important;
          color: #1e3a6b !important;
          transform: translateY(-1px);
        }
        .chatbot-send-btn:hover {
          background: #142b52 !important;
          transform: scale(1.05);
        }
        .chatbot-fab:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 8px 24px rgba(30,58,107,0.5) !important;
        }
        .chatbot-scrollbar::-webkit-scrollbar { width: 4px; }
        .chatbot-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chatbot-scrollbar::-webkit-scrollbar-thumb { background: #c7cdd8; border-radius: 4px; }
      `}</style>

      {/* Floating bubble button */}
      <button
        className="chatbot-fab"
        onClick={() => setIsOpen(v => !v)}
        title="Trợ lý HR"
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #1e3a6b, #2b4a85)',
          color: 'white', fontSize: '22px', cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(30,58,107,0.4)',
          transition: 'all 0.2s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: hasNewMsg ? 'chatbotBounce 0.6s ease infinite' : 'none',
        }}
      >
        {isOpen ? '✕' : '🤖'}
        {hasNewMsg && !isOpen && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#dc2626', border: '2px solid white',
            animation: 'chatbotBadgePop 0.3s ease'
          }} />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 9998,
          width: '360px', height: '560px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.1)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatbotSlideUp 0.25s ease-out',
          border: '1px solid #dce4f2'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #0b1f3d, #1e3a6b)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', border: '2px solid rgba(255,255,255,0.2)'
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Trợ lý HR</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Trực tuyến · Powered by Gemini AI
              </div>
            </div>
            <button
              onClick={handleReset}
              title="Cuộc trò chuyện mới"
              style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px', color: 'white', padding: '5px 8px',
                cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s'
              }}
            >🔄</button>
          </div>

          {/* Messages area */}
          <div
            className="chatbot-scrollbar"
            style={{
              flex: 1, overflowY: 'auto', padding: '14px 14px 4px',
              background: '#f7f8fa'
            }}
          >
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          {showQuickActions && (
            <div style={{
              padding: '8px 12px',
              background: '#f0f4fa',
              borderTop: '1px solid #e1e5ec',
              maxHeight: '140px',
              overflowY: 'auto'
            }}>
              <div style={{ fontSize: '11px', color: '#6b7588', marginBottom: '6px', fontWeight: 500 }}>
                💡 Câu hỏi gợi ý
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    className="chatbot-quick-btn"
                    onClick={() => sendMessage(qa.msg)}
                    style={{
                      background: 'white',
                      border: '1px solid #dce4f2',
                      borderRadius: '999px',
                      padding: '4px 10px',
                      fontSize: '11.5px',
                      color: '#3a4456',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div style={{
            padding: '10px 12px',
            borderTop: '1px solid #e1e5ec',
            display: 'flex', gap: '8px', alignItems: 'flex-end',
            background: 'white', flexShrink: 0
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hỏi bất cứ điều gì..."
              disabled={isLoading}
              rows={1}
              style={{
                flex: 1, resize: 'none', border: '1.5px solid #e1e5ec',
                borderRadius: '12px', padding: '9px 12px',
                fontSize: '13.5px', fontFamily: 'var(--font-jakarta, sans-serif)',
                outline: 'none', lineHeight: 1.4, maxHeight: '80px',
                overflowY: 'auto', transition: 'border-color 0.15s',
                background: isLoading ? '#f7f8fa' : 'white', color: '#3a4456'
              }}
              onFocus={e => e.target.style.borderColor = '#1e3a6b'}
              onBlur={e => e.target.style.borderColor = '#e1e5ec'}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              style={{
                width: '38px', height: '38px', borderRadius: '12px', border: 'none',
                background: (!input.trim() || isLoading) ? '#c7cdd8' : 'linear-gradient(135deg, #1e3a6b, #2b4a85)',
                color: 'white', cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', transition: 'all 0.15s', flexShrink: 0
              }}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: '5px 12px 8px',
            textAlign: 'center', fontSize: '10.5px', color: '#98a1b2',
            background: 'white'
          }}>
            {isAuthenticated
              ? `🔐 Đăng nhập với tư cách ${user?.role || 'nhân viên'}`
              : '🔓 Đăng nhập để hỏi về lương, công việc & nghỉ phép'}
          </div>
        </div>
      )}
    </>
  );
}
