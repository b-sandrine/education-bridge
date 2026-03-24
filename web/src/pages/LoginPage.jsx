import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useNotification } from '../hooks/useNotification';
import { Button, Input, Card, Alert } from '../components/CommonComponents';
import { authAPI } from '../services/api';
import { loginSuccess } from '../store/authSlice';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [serverError, setServerError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (values) => {
      setServerError(null);
      try {
        const response = await authAPI.login(values.email, values.password);
        const userData = response.data.data;
        dispatch(loginSuccess(userData));
        showSuccess('Login successful!');
        
        // Role-based redirection
        if (userData.user.role === 'educator') {
          navigate('/educator-dashboard');
        } else if (userData.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed. Please try again.';
        setServerError(message);
        showError(message);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>

        {serverError && <Alert type="error" message={serverError} />}

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="w-full"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </Card>
    </div>
  );
};
