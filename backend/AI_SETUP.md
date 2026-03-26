# AI API Setup Guide

This guide explains how to configure the AI chatbot feature for the EduBridge application.

## Overview

The student learning assistant uses external AI services to provide intelligent tutoring support. The application supports multiple AI providers:

- **OpenAI** (Recommended for production)
- **Anthropic Claude**
- **Google Gemini**

## OpenAI Setup (Recommended)

### 1. Get Your API Key

1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Navigate to **API keys** section
3. Click **Create new secret key**
4. Copy the key (keep it safe!)

### 2. Add to .env File

Update your `.env` file in the `backend/` directory:

```env
# AI Configuration
AI_SERVICE_PROVIDER=openai
AI_API_KEY=sk-your-actual-openai-api-key-here
AI_MODEL=gpt-4
```

### Recommended Models

- `gpt-4`: More intelligent, slightly slower, better for educational content ($0.03-0.06 per 1K tokens)
- `gpt-3.5-turbo`: Faster, cheaper, good accuracy ($0.0005-0.0015 per 1K tokens)

## Features Enabled

Once configured, students will have access to:

1. **In-Course AI Assistant** (ChatbotInterface)
   - Location: Course detail page, sidebar
   - Ask questions about course content
   - Get personalized explanations

2. **Context-Aware Learning**
   - AI understands which course/lesson you're viewing
   - Provides relevant learning support
   - Maintains conversation history during session

## Usage

### For Students
1. Go to any course you're viewing
2. Find the "AI Learning Assistant" panel on the right
3. Type your question
4. Receive instant educational support

### For Teachers (Educator Progress Tracking)
1. Go to Educator Dashboard
2. Click "View Student Progress" on any course
3. See:
   - Student progress analytics (completion rate, average score)
   - Individual student progress with lesson breakdown
   - Detailed progress tracking per student

## API Performance Considerations

**Expected Response Times:**
- First message: ~2-3 seconds
- Subsequent messages: ~1-2 seconds

**Cost Estimates (per course of 10 students):**
- If each student asks 10 questions per course: ~$0.50 - $2.00
- For GPT-3.5-turbo: ~$0.05 - $0.20

## Troubleshooting

### "Chatbot is temporarily unavailable"
- Check API key in `.env` file
- Verify API key has active credits
- Check OpenAI service status
- Review network connectivity

### Slow responses
- Normal for GPT-4, reduce timeout wait or use GPT-3.5-turbo
- Check current API load on OpenAI dashboard

### Rate limiting
- Each student can ask ~100 questions/minute
- Contact OpenAI support if hitting hard limits

## Security Best Practices

1. **Never commit API key to git**
   - Always use `.env` files
   - Add `.env` to `.gitignore`

2. **Rotate keys regularly** (monthly recommended)

3. **Monitor usage**
   - Check OpenAI dashboard weekly
   - Set usage alerts/limits

4. **Use environment-specific keys**
   - Development key with low limits
   - Production key with appropriate budget

## Setting Usage Limits (OpenAI Dashboard)

1. Go to OpenAI Platform > Billing
2. Set monthly usage limit to prevent unexpected charges
3. Example: $50/month soft limit, $100/month hard limit

## Multi-Provider Support

The application is designed for easy provider switching. To use a different provider:

1. Update `AI_SERVICE_PROVIDER` in `.env`
2. Update `AI_API_KEY` with appropriate credentials
3. May need to adjust `ChatbotService.js` for different API formats

Future implementations could add:
- Anthropic Claude
- Google Gemini
- Local LLaMA models
- Ollama integration

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [API Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
