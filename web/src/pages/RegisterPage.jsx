import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import { useNotification } from '../hooks/useNotification';
import { Button, Input, Card, Alert } from '../components/CommonComponents';
import { authAPI } from '../services/api';
import { registerSuccess } from '../store/authSlice';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const [serverError, setServerError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { firstName: '', lastName: '', email: '', password: '', role: 'student' },
    async (values) => {
      setServerError(null);
      try {
        const response = await authAPI.register(values);
        dispatch(registerSuccess(response.data.data));
        showSuccess('Registration successful!');
        navigate('/dashboard');
      } catch (error) {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        setServerError(message);
        showError(message);
      }
    }
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

        {serverError && <Alert type="error" message={serverError} />}

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />

          <Input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />

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
            placeholder="Password (min 8 characters)"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="w-full"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in here
          </a>
        </p>
      </Card>
    </div>
  );
};
