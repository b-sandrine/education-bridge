import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { aiAPI, contentAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { Card, Button, Input } from '../components/CommonComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot,
  faPlus,
  faTrash,
  faPaperPlane,
  faSpinner,
  faBook,
} from '@fortawesome/free-solid-svg-icons';

export const AITutorPage = () => {
  const user = useSelector((state) => state.auth.user);
  const { showSuccess, showError } = useNotification();

  // State management
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [courses, setCourses] = useState([]);
  const [learningProfile, setLearningProfile] = useState(null);
  const [showNewConvForm, setShowNewConvForm] = useState(false);
  const [newConvData, setNewConvData] = useState({
    title: '',
    courseId: '',
    topic: '',
    learningLevel: 'intermediate',
  });
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations and profile on mount
  useEffect(() => {
    fetchConversations();
    fetchLearningProfile();
    fetchCourses();
  }, []);

  // Load conversation messages when selected
  useEffect(() => {
    if (selectedConversation) {
      loadConversationMessages();
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.getConversations(50);
      setConversations(response.data.data || []);
    } catch (error) {
      showError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchLearningProfile = async () => {
    try {
      const response = await aiAPI.getLearningProfile();
      setLearningProfile(response.data.data);
    } catch (error) {
      // Profile might not exist yet, that's fine
      console.log('Learning profile not available yet');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await contentAPI.getAllCourses({});
      setCourses(response.data.data || []);
    } catch (error) {
      console.log('Failed to load courses');
    }
  };

  const loadConversationMessages = async () => {
    try {
      setLoading(true);
      const response = await aiAPI.getConversation(selectedConversation.id);
      setMessages(response.data.data.messages || []);
    } catch (error) {
      showError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const createNewConversation = async () => {
    if (!newConvData.title.trim()) {
      showError('Please enter a conversation title');
      return;
    }

    try {
      setCreating(true);
      const response = await aiAPI.createConversation({
        title: newConvData.title,
        courseId: newConvData.courseId || null,
        topic: newConvData.topic || null,
        learningLevel: newConvData.learningLevel,
      });

      setConversations([response.data.data, ...conversations]);
      setSelectedConversation(response.data.data);
      setMessages([]);
      setNewConvData({
        title: '',
        courseId: '',
        topic: '',
        learningLevel: 'intermediate',
      });
      setShowNewConvForm(false);
      showSuccess('Conversation created!');
    } catch (error) {
      showError('Failed to create conversation');
    } finally {
      setCreating(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation) {
      return;
    }

    const userMessage = input;
    setInput('');
    
    // Add user message to UI immediately
    setMessages([...messages, {
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString(),
    }]);

    try {
      setLoading(true);
      const response = await aiAPI.sendMessage(
        selectedConversation.id,
        userMessage,
        selectedConversation.topic
      );

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.data.response,
        created_at: new Date().toISOString(),
      }]);

      // Update conversation in list
      fetchConversations();
    } catch (error) {
      showError('Failed to send message');
      // Remove user message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    if (!window.confirm('Delete this conversation?')) return;

    try {
      await aiAPI.deleteConversation(conversationId);
      setConversations(conversations.filter(c => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      showSuccess('Conversation deleted');
    } catch (error) {
      showError('Failed to delete conversation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-8 px-6 w-full ml-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Sidebar - Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faRobot} className="text-blue-600" />
                Chat History
              </h2>
              <Button
                variant="primary"
                onClick={() => setShowNewConvForm(!showNewConvForm)}
                className="w-full flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} />
                New Chat
              </Button>
            </div>

            {/* New Conversation Form */}
            {showNewConvForm && (
              <div className="mb-4 pb-4 border-b border-gray-200 space-y-3">
                <Input
                  type="text"
                  placeholder="Conversation title..."
                  value={newConvData.title}
                  onChange={(e) => setNewConvData({ ...newConvData, title: e.target.value })}
                  className="text-sm"
                />
                <select
                  value={newConvData.courseId}
                  onChange={(e) => setNewConvData({ ...newConvData, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="">No specific course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <Input
                  type="text"
                  placeholder="Topic (optional)..."
                  value={newConvData.topic}
                  onChange={(e) => setNewConvData({ ...newConvData, topic: e.target.value })}
                  className="text-sm"
                />
                <select
                  value={newConvData.learningLevel}
                  onChange={(e) => setNewConvData({ ...newConvData, learningLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={createNewConversation}
                    disabled={creating}
                    className="flex-1 text-sm"
                  >
                    Create
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowNewConvForm(false)}
                    className="flex-1 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No conversations yet. Start a new chat!
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedConversation?.id === conv.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div
                      onClick={() => setSelectedConversation(conv)}
                      className="mb-2"
                    >
                      <p className="font-semibold text-sm line-clamp-2">{conv.title}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {conv.message_count || 0} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 w-full"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Learning Profile */}
            {learningProfile && learningProfile.total_conversations > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">Your Progress</p>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>💬 {learningProfile.total_conversations} chats</p>
                  <p>💬 {learningProfile.total_messages} messages</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          {selectedConversation ? (
            <Card className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{selectedConversation.title}</h2>
                {selectedConversation.topic && (
                  <p className="text-gray-600 text-sm mt-1">
                    <FontAwesomeIcon icon={faBook} className="mr-2" />
                    Topic: {selectedConversation.topic}
                  </p>
                )}
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 p-4 rounded">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faRobot} className="text-4xl text-gray-300 mb-4" />
                    <p className="text-gray-500">Start chatting with your AI learning companion!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`px-4 py-3 rounded-lg max-w-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 opacity-70`}>
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 px-4 py-3 rounded-lg border border-gray-200">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      AI is thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
                  placeholder="Ask me anything about this topic..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
                <Button
                  variant="primary"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="flex items-center gap-2 px-6"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                  Send
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon icon={faRobot} className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Learning Companion</h3>
                <p className="text-gray-600 mb-6">
                  Select a conversation or create a new one to get started
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowNewConvForm(true)}
                  className="flex items-center gap-2 justify-center mx-auto"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Start New Chat
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
