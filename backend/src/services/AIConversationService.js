import pool from '../config/database.js';
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '../utils/errors.js';

class AIConversationService {
  /**
   * Create a new AI conversation session
   */
  static async createConversation(studentId, courseId, title, topic, learningLevel) {
    const conversationId = uuid();
    const query = `
      INSERT INTO ai_conversations (id, student_id, course_id, title, topic, learning_level, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [conversationId, studentId, courseId, title, topic, learningLevel]);
    return result.rows[0];
  }

  /**
   * Get all conversations for a student
   */
  static async getStudentConversations(studentId, limit = 50) {
    const query = `
      SELECT 
        ac.id,
        ac.student_id,
        ac.course_id,
        ac.title,
        ac.topic,
        ac.learning_level,
        COUNT(acm.id) as message_count,
        MAX(acm.created_at) as last_message_at,
        ac.created_at,
        ac.updated_at
      FROM ai_conversations ac
      LEFT JOIN ai_chat_messages acm ON ac.id = acm.conversation_id
      WHERE ac.student_id = $1
      GROUP BY ac.id, ac.student_id, ac.course_id, ac.title, ac.topic, ac.learning_level, ac.created_at, ac.updated_at
      ORDER BY COALESCE(MAX(acm.created_at), ac.updated_at) DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [studentId, limit]);
    return result.rows;
  }

  /**
   * Get a specific conversation with all its messages
   */
  static async getConversationWithMessages(conversationId, studentId) {
    const query = `
      SELECT 
        ac.id,
        ac.student_id,
        ac.course_id,
        ac.title,
        ac.topic,
        ac.learning_level,
        ac.created_at,
        ac.updated_at,
        json_agg(
          json_build_object(
            'id', acm.id,
            'role', acm.role,
            'content', acm.content,
            'message_order', acm.message_order,
            'created_at', acm.created_at
          ) ORDER BY acm.message_order ASC
        ) FILTER (WHERE acm.id IS NOT NULL) as messages
      FROM ai_conversations ac
      LEFT JOIN ai_chat_messages acm ON ac.id = acm.conversation_id
      WHERE ac.id = $1 AND ac.student_id = $2
      GROUP BY ac.id, ac.student_id, ac.course_id, ac.title, ac.topic, ac.learning_level, ac.created_at, ac.updated_at
    `;
    const result = await pool.query(query, [conversationId, studentId]);
    if (result.rows.length === 0) {
      throw new NotFoundError('Conversation not found');
    }
    return result.rows[0];
  }

  /**
   * Add a message to a conversation
   */
  static async addMessageToConversation(conversationId, studentId, role, content) {
    const messageId = uuid();
    
    // Get the next message order
    const orderQuery = `
      SELECT COALESCE(MAX(message_order), 0) + 1 as next_order
      FROM ai_chat_messages
      WHERE conversation_id = $1
    `;
    const orderResult = await pool.query(orderQuery, [conversationId]);
    const messageOrder = orderResult.rows[0].next_order;

    const query = `
      INSERT INTO ai_chat_messages (id, conversation_id, student_id, role, content, message_order, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [messageId, conversationId, studentId, role, content, messageOrder]);
    
    // Update conversation updated_at
    await pool.query(
      'UPDATE ai_conversations SET updated_at = NOW() WHERE id = $1',
      [conversationId]
    );

    return result.rows[0];
  }

  /**
   * Get conversation history for context (last N messages)
   */
  static async getConversationHistory(conversationId, studentId, limit = 10) {
    const query = `
      SELECT role, content, created_at
      FROM ai_chat_messages
      WHERE conversation_id = $1 AND student_id = $2
      ORDER BY message_order DESC
      LIMIT $3
    `;
    const result = await pool.query(query, [conversationId, studentId, limit]);
    return result.rows.reverse(); // Return in ascending order for context
  }

  /**
   * Delete a conversation and all its messages
   */
  static async deleteConversation(conversationId, studentId) {
    const query = `
      DELETE FROM ai_conversations
      WHERE id = $1 AND student_id = $2
      RETURNING id
    `;
    const result = await pool.query(query, [conversationId, studentId]);
    if (result.rows.length === 0) {
      throw new NotFoundError('Conversation not found');
    }
    return result.rows[0];
  }

  /**
   * Update conversation title
   */
  static async updateConversationTitle(conversationId, studentId, newTitle) {
    const query = `
      UPDATE ai_conversations
      SET title = $1, updated_at = NOW()
      WHERE id = $2 AND student_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [newTitle, conversationId, studentId]);
    if (result.rows.length === 0) {
      throw new NotFoundError('Conversation not found');
    }
    return result.rows[0];
  }

  /**
   * Get learning profile from all conversations
   */
  static async getLearningProfile(studentId) {
    const query = `
      SELECT 
        COUNT(DISTINCT ac.id) as total_conversations,
        COUNT(acm.id) as total_messages,
        MIN(ac.created_at) as first_interaction,
        MAX(acm.created_at) as last_interaction
      FROM ai_conversations ac
      LEFT JOIN ai_chat_messages acm ON ac.id = acm.conversation_id
      WHERE ac.student_id = $1
    `;
    const result = await pool.query(query, [studentId]);
    const profile = result.rows[0];

    // Get topics covered separately
    const topicsQuery = `
      SELECT 
        ac.topic,
        COUNT(acm.id) as message_count
      FROM ai_conversations ac
      LEFT JOIN ai_chat_messages acm ON ac.id = acm.conversation_id
      WHERE ac.student_id = $1 AND ac.topic IS NOT NULL
      GROUP BY ac.topic
    `;
    const topicsResult = await pool.query(topicsQuery, [studentId]);
    
    // Convert topics to object
    const topics_covered = {};
    topicsResult.rows.forEach(row => {
      topics_covered[row.topic] = row.message_count;
    });

    return {
      ...profile,
      topics_covered: Object.keys(topics_covered).length > 0 ? topics_covered : null
    };
  }
}

export default AIConversationService;
