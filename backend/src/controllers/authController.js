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

export const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName } = req.body;
  const user = await AuthService.updateUserProfile(req.user.id, {
    firstName,
    lastName,
  });
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

// Admin user management endpoints
export const getAllUsers = asyncHandler(async (req, res) => {
  const role = req.query.role;
  const users = role
    ? await AuthService.getUsersByRole(role)
    : await AuthService.getAllUsers();
  res.status(200).json({
    status: 'success',
    data: users,
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await AuthService.updateUserRole(req.params.userId, role);
  res.status(200).json({
    status: 'success',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.userId === req.user.id) {
    throw new Error('Cannot delete your own account');
  }
  await AuthService.deleteUser(req.params.userId);
  res.status(204).send();
});
