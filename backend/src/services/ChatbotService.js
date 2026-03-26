import axios from 'axios';
import logger from '../utils/logger.js';

class ChatbotService {
  static async generateResponse(query, courseContext = null, language = 'en') {
    try {
      // Build system prompt with course context for better answers
      let systemPrompt = 'You are an educational assistant helping students learn.';
      
      if (courseContext) {
        systemPrompt = `You are an educational learning assistant. The student is learning about: ${courseContext}. 
        
Provide clear, helpful answers about this course. You can answer questions about:
- What the course covers and learning objectives
- Explanations of concepts taught in the course
- How to approach problems related to the course material
- Study tips and learning strategies
- Clarifications of course content

Be friendly, encouraging, and tailor your explanations to support active learning.`;
      }

      const response = await axios.post(
        process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
        {
          model: process.env.AI_MODEL || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        query,
        response: response.data.choices[0].message.content,
        language,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Chatbot error:', error);
      
      // Fallback response if AI service is unavailable
      return {
        query,
        response: 'I apologize, the AI service is temporarily unavailable. Please try again later or contact support.',
        language,
        timestamp: new Date(),
      };
    }
  }

  static async saveQuery(userId, query, response, courseId = null) {
    // Save chatbot interaction to database for analytics
    logger.info({
      userId,
      query,
      courseId,
      timestamp: new Date(),
    });

    return {
      userId,
      query,
      response,
      courseId,
      timestamp: new Date(),
    };
  }
}

export default ChatbotService;
