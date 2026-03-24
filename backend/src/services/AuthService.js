import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { UnauthorizedError, ConflictError } from '../utils/errors.js';

class AuthService {
  static async register(userData) {
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const user = await User.create(userData);
    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      token,
    };
  }

  static async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatch = await User.comparePassword(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      token,
    };
  }

  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };
  }

  static async createAdmin(adminData) {
    const existingUser = await User.findByEmail(adminData.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const adminUserData = {
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      email: adminData.email,
      password: adminData.password,
      role: 'admin',
    };

    const user = await User.create(adminUserData);
    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      token,
      message: 'Admin account created successfully',
    };
  }
}

export default AuthService;
