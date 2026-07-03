import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../../shared/types';
import { sendChatMessage } from '../api';
import styles from './ChatPanel.module.css';

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm your task assistant. Ask me things like \"What should I work on next?\" or \"Help me break down a task.\" 💪",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send only the conversation history (excluding the welcome message)
      const history = updatedMessages.slice(1);
      const reply = await sendChatMessage(text, history.slice(0, -1));
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, I couldn't process that. ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Chat cleared! How can I help you with your tasks? 🧹",
      },
    ]);
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className={styles.fab}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        title="Task Assistant"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Task Assistant">
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>🤖 Task Assistant</h3>
            <button
              className={styles.clearBtn}
              onClick={handleClear}
              title="Clear chat"
              aria-label="Clear chat history"
            >
              🗑️
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.assistantMsg}`}
              >
                <p className={styles.messageText}>{msg.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMsg}`}>
                <p className={styles.messageText}>
                  <span className={styles.typing}>Thinking...</span>
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your tasks..."
              disabled={isLoading}
              aria-label="Chat message"
            />
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
