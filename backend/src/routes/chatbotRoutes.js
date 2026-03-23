import express from 'express';
import * as chatbotController from '../controllers/chatbotController.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { chatbotQuerySchema } from '../utils/validators.js';

const router = express.Router();

router.post(
  '/ask',
  authenticate,
  validateRequest(chatbotQuerySchema),
  chatbotController.askQuestion
);

export default router;
