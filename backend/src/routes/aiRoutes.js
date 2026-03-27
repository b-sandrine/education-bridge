import express from 'express';
import {
  createConversation,
  getConversations,
  getConversation,
  sendMessage,
  deleteConversation,
  updateConversationTitle,
  getLearningProfile,
} from '../controllers/aiConversationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// All AI conversation routes require authentication
router.use(authenticate);

// Authorization middleware for AI routes
const authorizeAIRoutes = (req, res, next) => {
  if (!['student', 'educator', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ status: 'error', message: 'Unauthorized' });
  }
  next();
};

/**
 * Create a new conversation
 * POST /api/ai/conversations
 */
router.post('/conversations', authorizeAIRoutes, createConversation);

/**
 * Get all conversations for current user
 * GET /api/ai/conversations
 */
router.get('/conversations', authorizeAIRoutes, getConversations);

/**
 * Get specific conversation with all messages
 * GET /api/ai/conversations/:conversationId
 */
router.get('/conversations/:conversationId', authorizeAIRoutes, getConversation);

/**
 * Send message to conversation (generates AI response)
 * POST /api/ai/conversations/:conversationId/messages
 */
router.post('/conversations/:conversationId/messages', authorizeAIRoutes, sendMessage);

/**
 * Update conversation title
 * PUT /api/ai/conversations/:conversationId
 */
router.put('/conversations/:conversationId', authorizeAIRoutes, updateConversationTitle);

/**
 * Delete conversation
 * DELETE /api/ai/conversations/:conversationId
 */
router.delete('/conversations/:conversationId', authorizeAIRoutes, deleteConversation);

/**
 * Get learning profile
 * GET /api/ai/learning-profile
 */
router.get('/learning-profile', authorizeAIRoutes, getLearningProfile);

export default router;
