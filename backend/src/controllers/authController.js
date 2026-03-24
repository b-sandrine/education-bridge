import AuthService from '../services/AuthService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body);
  res.status(201).json({
    status: 'success',
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await AuthService.getUserById(req.user.id);
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const createAdmin = asyncHandler(async (req, res) => {
  const result = await AuthService.createAdmin(req.body);
  res.status(201).json({
    status: 'success',
    data: result,
  });
});
