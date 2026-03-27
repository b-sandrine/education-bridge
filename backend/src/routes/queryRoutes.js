import express from 'express';
import * as queryController from '../controllers/queryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.post(
  '/queries',
  authenticate,
  authorize('student'),
  queryController.createQuery
);

router.get(
  '/queries',
  authenticate,
  authorize('student'),
  queryController.getMyQueries
);

router.delete(
  '/queries/:id',
  authenticate,
  authorize('student'),
  queryController.deleteQuery
);

// Admin routes
router.get(
  '/admin/queries',
  authenticate,
  authorize('admin'),
  queryController.getAdminQueries
);

router.get(
  '/admin/queries/:id',
  authenticate,
  authorize('admin'),
  queryController.getQueryById
);

router.put(
  '/admin/queries/:id/respond',
  authenticate,
  authorize('admin'),
  queryController.respondToQuery
);

router.put(
  '/admin/queries/:id/status',
  authenticate,
  authorize('admin'),
  queryController.updateQueryStatus
);

export default router;
