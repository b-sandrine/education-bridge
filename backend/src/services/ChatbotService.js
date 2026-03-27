import axios from 'axios';
import logger from '../utils/logger.js';

class ChatbotService {
  static async generateResponse(query, courseContext = null, language = 'en') {
    try {
      const provider = process.env.AI_SERVICE_PROVIDER || 'openai';

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

      // Route to appropriate provider
      if (provider === 'google') {
        return await this.generateGoogleResponse(query, systemPrompt, language);
      } else if (provider === 'anthropic') {
        return await this.generateAnthropicResponse(query, systemPrompt, language);
      } else {
        // Default to OpenAI
        return await this.generateOpenAIResponse(query, systemPrompt, language);
      }
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

  static async generateOpenAIResponse(query, systemPrompt, language) {
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
  }

  static async generateGoogleResponse(query, systemPrompt, language) {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    const model = process.env.AI_MODEL || 'gemini-1.5-flash';
    
    // Correct Google Generative AI REST API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await axios.post(
        url,
        {
          contents: [
            {
              role: 'user',
              parts: [
                { text: systemPrompt + '\n\n' + query }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 1,
            topK: 1,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        logger.warn('Empty response from Google Gemini', {
          response: response.data,
          query,
        });
        throw new Error('No response content from Google Gemini');
      }

      return {
        query,
        response: content,
        language,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Google Gemini API error', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url,
        message: error.message,
        errorData: error.response?.data,
      });
      throw error;
    }
  }

  static async generateAnthropicResponse(query, systemPrompt, language) {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: process.env.AI_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: query
          }
        ]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
      }
    );

    const content = response.data.content[0]?.text;
    if (!content) {
      throw new Error('No response from Anthropic Claude');
    }

    return {
      query,
      response: content,
      language,
      timestamp: new Date(),
    };
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
