import axios from 'axios';
import logger from '../utils/logger.js';

class ChatbotService {
  static async generateResponse(query, courseContext = null, language = 'en', contextData = {}) {
    try {
      const provider = process.env.AI_SERVICE_PROVIDER || 'openai';
      const { conversationHistory = [], learningProfile = {} } = contextData;

      let systemPrompt = this.buildSystemPrompt(courseContext, learningProfile);
      let messages = this.buildConversationMessages(query, systemPrompt, conversationHistory);

      // Route to appropriate provider
      if (provider === 'google') {
        return await this.generateGoogleResponse(query, systemPrompt, language, conversationHistory);
      } else if (provider === 'anthropic') {
        return await this.generateAnthropicResponse(query, systemPrompt, language, conversationHistory);
      } else {
        // Default to OpenAI
        return await this.generateOpenAIResponse(query, systemPrompt, language, messages);
      }
    } catch (error) {
      logger.error('Chatbot API error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorDetails: error.response?.data,
        provider: process.env.AI_SERVICE_PROVIDER,
      });
      
      // Fallback response if AI service is unavailable
      return {
        query,
        response: 'I apologize, the AI service is temporarily unavailable. Please try again later or contact support.',
        language,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Build system prompt based on course context and learning profile
   */
  static buildSystemPrompt(courseContext, learningProfile = {}) {
    let systemPrompt = `You are an advanced educational AI learning companion that learns alongside students. 
Your role is to:
- Provide personalized explanations based on the student's learning level
- Remember and reference previous discussions from this conversation
- Adapt your teaching style based on feedback and student progress  
- Ask clarifying questions to check understanding
- Provide encouragement and celebrate learning milestones
- Suggest related topics and deeper dives when appropriate

Be friendly, encouraging,  interactive, and supportive. Use simple language but challenge them appropriately.`;

    if (courseContext) {
      systemPrompt += `

CURRENT CONTEXT:
The student is learning about: ${courseContext}

Your answers should:
- Focus on this course's learning objectives
- Provide clear, structured explanations
- Use examples from the course material
- Check for understanding with follow-up questions
- Suggest practice problems or activities when relevant`;
    }

    if (learningProfile?.total_conversations > 0) {
      systemPrompt += `

STUDENT PROFILE:
- Learning History: ${learningProfile.total_conversations} conversations (${learningProfile.total_messages} messages)
- Topics Covered: ${Object.keys(learningProfile.topics_covered || {}).join(', ') || 'Various topics'}
- Learning Pattern: ${learningProfile.total_conversations > 5 ? 'Regular learner - encourage consistency' : 'Beginning learner - provide extra support'}`;
    }

    return systemPrompt;
  }

  /**
   * Build conversation messages including history
   */
  static buildConversationMessages(query, systemPrompt, conversationHistory = []) {
    const messages = [{ role: 'system', content: systemPrompt }];
    
    // Add recent conversation history for context
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }
    
    // Add current query
    messages.push({ role: 'user', content: query });
    
    return messages;
  }

  static async generateOpenAIResponse(query, systemPrompt, language, messages = null) {
    // If messages array is provided, use it; otherwise build from query
    const payload = messages 
      ? {
          model: process.env.AI_MODEL || 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.9,
        }
      : {
          model: process.env.AI_MODEL || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        };

    const response = await axios.post(
      process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions',
      payload,
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

  static async generateGoogleResponse(query, systemPrompt, language, conversationHistory = []) {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      throw new Error('Google Gemini API key not configured');
    }

    const model = process.env.AI_MODEL || 'gemini-1.5-flash';
    
    // Correct Google Generative AI REST API endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      // Build conversation contents
      const contents = [];
      
      // Add conversation history
      if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [
              { text: msg.content }
            ]
          });
        });
      }
      
      // Add current query with system prompt in first message
      contents.push({
        role: 'user',
        parts: [
          { text: systemPrompt + '\n\n' + query }
        ]
      });

      const response = await axios.post(
        url,
        {
          contents,
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
          timeout: 30000,
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
      const status = error.response?.status;
      const errorMessage = error.response?.data?.error?.message;
      
      logger.error('Google Gemini API error', {
        status,
        statusText: error.response?.statusText,
        errorMessage,
        fullError: error.response?.data,
        apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET',
      });

      // Provide specific error info
      const errorInfo = new Error(
        status === 403 
          ? `Google Gemini API access denied (403). Check your API key and ensure it has the Generative Language API enabled. Error: ${errorMessage}`
          : status === 401
          ? `Google Gemini API authentication failed (401). Invalid API key.`
          : `Google Gemini API error: ${errorMessage || error.message}`
      );
      errorInfo.status = status;
      throw errorInfo;
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
