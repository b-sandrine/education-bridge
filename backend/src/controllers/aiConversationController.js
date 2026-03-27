import AIConversationService from '../services/AIConversationService.js';
import ChatbotService from '../services/ChatbotService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * Create a new AI conversation
 */
export const createConversation = asyncHandler(async (req, res) => {
  const { title, courseId, topic, learningLevel } = req.body;
  const studentId = req.user.id;

  if (!title) {
    return res.status(400).json({ status: 'error', message: 'Title is required' });
  }

  const conversation = await AIConversationService.createConversation(
    studentId,
    courseId || null,
    title,
    topic || null,
    learningLevel || 'intermediate'
  );

  res.status(201).json({
    status: 'success',
    data: conversation,
  });
});

/**
 * Get all conversations for a student
 */
export const getConversations = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { limit } = req.query;

  const conversations = await AIConversationService.getStudentConversations(
    studentId,
    limit ? parseInt(limit) : 50
  );

  res.status(200).json({
    status: 'success',
    data: conversations,
  });
});

/**
 * Get a specific conversation with messages
 */
export const getConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const studentId = req.user.id;

  const conversation = await AIConversationService.getConversationWithMessages(
    conversationId,
    studentId
  );

  res.status(200).json({
    status: 'success',
    data: conversation,
  });
});

/**
 * Send a message in a conversation
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { message, courseContext } = req.body;
  const studentId = req.user.id;

  if (!message || !message.trim()) {
    return res.status(400).json({ status: 'error', message: 'Message is required' });
  }

  // Add user message to conversation
  await AIConversationService.addMessageToConversation(
    conversationId,
    studentId,
    'user',
    message
  );

  // Get conversation history for context
  const conversationHistory = await AIConversationService.getConversationHistory(
    conversationId,
    studentId,
    15 // Get last 15 messages for context
  );

  // Get learning profile for personalization
  const learningProfile = await AIConversationService.getLearningProfile(studentId);

  // Generate AI response with full context
  const aiResponse = await ChatbotService.generateResponse(message, courseContext, 'en', {
    conversationHistory,
    learningProfile,
    studentId,
  });

  // Add AI response to conversation
  await AIConversationService.addMessageToConversation(
    conversationId,
    studentId,
    'assistant',
    aiResponse.response
  );

  // Save interaction for general tracking
  await ChatbotService.saveQuery(studentId, message, aiResponse.response, null);

  res.status(200).json({
    status: 'success',
    data: {
      response: aiResponse.response,
    },
  });
});

/**
 * Delete a conversation
 */
export const deleteConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const studentId = req.user.id;

  await AIConversationService.deleteConversation(conversationId, studentId);

  res.status(200).json({
    status: 'success',
    message: 'Conversation deleted successfully',
  });
});

/**
 * Update conversation title
 */
export const updateConversationTitle = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { title } = req.body;
  const studentId = req.user.id;

  if (!title || !title.trim()) {
    return res.status(400).json({ status: 'error', message: 'Title is required' });
  }

  const conversation = await AIConversationService.updateConversationTitle(
    conversationId,
    studentId,
    title
  );

  res.status(200).json({
    status: 'success',
    data: conversation,
  });
});

/**
 * Get student's learning profile
 */
export const getLearningProfile = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const profile = await AIConversationService.getLearningProfile(studentId);

  res.status(200).json({
    status: 'success',
    data: profile,
  });
});
