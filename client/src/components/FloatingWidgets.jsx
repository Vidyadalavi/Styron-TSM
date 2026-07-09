import { useState, useRef, useEffect } from 'react';
import { API_URL } from '../config';

const WaIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 30, height: 30, fill: '#fff' }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, fill: '#fff' }}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const AiIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, fill: '#fff' }}>
    <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 010 2h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 010-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2M9 11a5 5 0 00-5 5v3h16v-3a5 5 0 00-5-5H9m3 2a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>
  </svg>
);

const QUICK_PROMPTS = [
  { label: 'Stirrup types', msg: 'What stirrup types do you offer?' },
  { label: 'Delivery time', msg: 'What are your delivery timelines?' },
  { label: 'Custom shapes', msg: 'Can you make custom shapes from drawings?' },
  { label: 'Steel grades', msg: 'What steel grades are available?' },
];

export default function FloatingWidgets() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'ai', text: '👋 Hi! I\'m Styron\'s AI assistant. I can help you with product info, specifications, pricing estimates, or help you find the right steel reinforcement for your project. How can I assist?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatOpen) {
      inputRef.current?.focus();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatOpen, messages]);

  const sendMsg = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setShowQuick(false);
    setMessages((prev) => [...prev, { role: 'user', text: msg }]);
    const newHistory = [...history, { role: 'user', content: msg }];
    setHistory(newHistory);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      const reply = data.text || 'Sorry, I could not get a response. Please try again.';
      setHistory((h) => [...h, { role: 'assistant', content: reply }]);
      setMessages((prev) => [...prev, { role: 'ai', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please call us at +91 98XXX XXXXX or WhatsApp us!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* WhatsApp float */}
      <a href="https://wa.me/919800000000" target="_blank" rel="noreferrer" className="wa-float" title="Chat on WhatsApp">
        <div className="wa-tooltip">Chat on WhatsApp</div>
        <WaIcon />
      </a>

      {/* AI FAB */}
      <button className="ai-fab" onClick={() => setChatOpen((o) => !o)} title="AI Assistant">
        <div className="ai-fab-tooltip">Ask AI Assistant</div>
        <AiIcon />
      </button>

      {/* AI Chat Window */}
      <div className={`ai-chat-window${chatOpen ? ' open' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-avatar">🤖</div>
          <div className="ai-chat-header-text">
            <h4>Styron AI Assistant</h4>
            <p>Ask about products, pricing &amp; more</p>
          </div>
          <button className="ai-chat-close" onClick={() => setChatOpen(false)}>✕</button>
        </div>

        <div className="ai-chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}${m.thinking ? ' thinking' : ''}`}>{m.text}</div>
          ))}
          {loading && <div className="msg ai thinking">Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        {showQuick && (
          <div className="ai-quick-btns">
            {QUICK_PROMPTS.map((q) => (
              <button key={q.label} className="ai-quick" onClick={() => sendMsg(q.msg)}>{q.label}</button>
            ))}
          </div>
        )}

        <div className="ai-chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask anything about our products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
          />
          <button className="ai-send" onClick={() => sendMsg()}>
            <SendIcon />
          </button>
        </div>
        <div className="ai-powered">Powered by Claude AI</div>
      </div>
    </>
  );
}
