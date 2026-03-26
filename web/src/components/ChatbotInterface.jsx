import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAppStore';
import { chatbotAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { Button, Card, Input } from '../components/CommonComponents';

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
    <Card className="w-full h-96 flex flex-col">
      <h3 className="text-xl font-bold mb-4">AI Learning Assistant</h3>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 p-4 rounded">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center py-8">Ask me anything about this course!</p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
              Thinking...
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
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          disabled={loading}
        />
        <Button
          variant="primary"
          onClick={handleSendMessage}
          loading={loading}
        >
          Send
        </Button>
      </div>
    </Card>
  );
};
