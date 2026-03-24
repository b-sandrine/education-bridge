import { UnauthorizedError } from '../utils/errors.js';

/**
 * Middleware to validate admin secret key
 * Expects the secret key in the 'X-Admin-Secret' header
 */
export const validateAdminSecret = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  
  if (!adminSecret) {
    throw new UnauthorizedError('Admin creation is not enabled. Set ADMIN_SECRET_KEY environment variable.');
  }

  const providedSecret = req.headers['x-admin-secret'];
  
  if (!providedSecret) {
    throw new UnauthorizedError('Missing X-Admin-Secret header');
  }

  if (providedSecret !== adminSecret) {
    throw new UnauthorizedError('Invalid admin secret key');
  }

  next();
};
