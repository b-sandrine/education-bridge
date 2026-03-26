import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateAdminSecret } from '../middleware/adminSecret.js';
import { validateRequest } from '../middleware/validation.js';
import { userRegistrationSchema } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRequest(userRegistrationSchema), authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/create-admin', validateAdminSecret, validateRequest(userRegistrationSchema), authController.createAdmin);

// Admin user management endpoints
router.get('/users', authenticate, authorize('admin'), authController.getAllUsers);
router.put('/users/:userId/role', authenticate, authorize('admin'), authController.updateUserRole);
router.delete('/users/:userId', authenticate, authorize('admin'), authController.deleteUser);

export default router;
