import { useEffect, useState } from 'react';
import { askNews } from '../services/api';

export default function ChatPanel({ userId, seedQuestion }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!seedQuestion) return;
    setInput(seedQuestion);
  }, [seedQuestion]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: 'You', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const data = await askNews({ question, userId });
      setMessages((prev) => [...prev, { role: 'AI', text: data.answer }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'AI', text: error.response?.data?.error || error.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="chat">
      <h2>Ask News</h2>
      <div className="chat-messages">
        {messages.length === 0 && <p className="muted">Try asking: “What matters most in global markets this week?”</p>}
        {messages.map((message, index) => (
          <p key={`${message.role}-${index}`}>
            <strong>{message.role}:</strong> {message.text}
          </p>
        ))}
        {loading && <p>Thinking…</p>}
      </div>
      <form className="chat-input" onSubmit={sendMessage}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about recent business news" />
        <button id="send-btn" type="submit" disabled={loading}>
          Send
        </button>
      </form>
    </aside>
  );
}
