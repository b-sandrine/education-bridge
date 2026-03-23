import ChatbotService from '../services/ChatbotService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const askQuestion = asyncHandler(async (req, res) => {
  const { message, courseId, language } = req.body;

  const response = await ChatbotService.generateResponse(message, courseId, language);
  await ChatbotService.saveQuery(req.user.id, message, response.response, courseId);

  res.status(200).json({
    status: 'success',
    data: response,
  });
});
