import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAppStore';
import { chatbotAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { Button, Card, Input } from '../components/CommonComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

// Color scheme
const colors = {
  primary: '#1E3A8A',
  accent: '#F97316',
  background: '#F8FAFC',
  text: '#0F172A'
};

export const ChatbotInterface = ({ courseId, courseTitle, courseDescription }) => {
  const { user, token } = useAuth();
  const { showError } = useNotification();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || !token) {
      showError('Please log in to use the chatbot');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Include course context in the request
      const courseContext = courseTitle
        ? `Course: ${courseTitle}. ${courseDescription || ''}`
        : null;

      const response = await chatbotAPI.askQuestion({
        message: input,
        courseId,
        courseContext,
        language: 'en',
      });

      const botMessage = {
        role: 'assistant',
        content: response.data.data.response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      showError('Failed to get response from chatbot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-96 flex flex-col border-2" style={{ borderColor: colors.primary }}>
      <div className="flex items-center gap-2 mb-4" style={{ color: colors.primary }}>
        <FontAwesomeIcon icon={faRobot} className="text-xl" />
        <h3 className="text-xl font-bold">AI Learning Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-4 rounded" style={{ backgroundColor: colors.background }}>
        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-8 italic">Ask me anything about this course!</p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                msg.role === 'user'
                  ? 'text-white rounded-br-none'
                  : 'rounded-bl-none'
              }`}
              style={{
                backgroundColor: msg.role === 'user' ? colors.primary : '#e5e7eb',
                color: msg.role === 'user' ? 'white' : colors.text
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-lg rounded-bl-none animate-pulse" style={{ backgroundColor: '#e5e7eb', color: colors.text }}>
              <span>Thinking</span>
              <span className="inline-flex gap-1 ml-1">
                <span className="w-1 h-1 bg-current rounded-full"></span>
                <span className="w-1 h-1 bg-current rounded-full"></span>
                <span className="w-1 h-1 bg-current rounded-full"></span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask a question..."
          className="flex-1 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{
            borderColor: colors.primary,
            backgroundColor: colors.background
          }}
          onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 3px rgba(30, 58, 138, 0.1)`}
          onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
          disabled={loading}
        />
        <Button
          variant="primary"
          onClick={handleSendMessage}
          loading={loading}
          className="px-4 py-2 rounded-lg font-semibold transition-all hover:shadow-lg"
          style={{
            backgroundColor: colors.accent,
            color: 'white'
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
          Send
        </Button>
      </div>
    </Card>
  );
};
