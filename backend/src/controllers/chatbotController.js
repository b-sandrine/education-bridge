import ChatbotService from '../services/ChatbotService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const askQuestion = asyncHandler(async (req, res) => {
  const { message, courseId, courseContext, language } = req.body;

  // Use courseContext if provided, otherwise use courseId for backwards compatibility
  const context = courseContext || courseId;
  
  const response = await ChatbotService.generateResponse(message, context, language);
  await ChatbotService.saveQuery(req.user.id, message, response.response, courseId);

  res.status(200).json({
    status: 'success',
    data: response,
  });
});
