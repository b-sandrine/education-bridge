import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateAdminSecret } from '../middleware/adminSecret.js';
import { validateRequest } from '../middleware/validation.js';
import { userRegistrationSchema } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRequest(userRegistrationSchema), authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.post('/create-admin', validateAdminSecret, validateRequest(userRegistrationSchema), authController.createAdmin);

export default router;
