import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm } from '../hooks/useForm';
import { authAPI } from '../services/api';
import { loginSuccess } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input, Card, Alert } from '../components/CommonComponents';

export const RegisterScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { firstName: '', lastName: '', email: '', password: '', role: 'student' },
    async (values) => {
      setServerError(null);
      try {
        const response = await authAPI.register(values);
        dispatch(loginSuccess(response.data.data));
        await AsyncStorage.setItem('token', response.data.data.token);
        navigation.navigate('Dashboard');
      } catch (error) {
        const message = error.response?.data?.message || 'Registration failed';
        setServerError(message);
      }
    }
  );

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Text style={styles.title}>Create Account</Text>

        {serverError && <Alert type="error" message={serverError} />}

        <Input
          label="First Name"
          placeholder="John"
          value={values.firstName}
          onChangeText={(text) => handleChange('firstName', text)}
          error={errors.firstName}
        />

        <Input
          label="Last Name"
          placeholder="Doe"
          value={values.lastName}
          onChangeText={(text) => handleChange('lastName', text)}
          error={errors.lastName}
        />

        <Input
          label="Email"
          placeholder="john@example.com"
          value={values.email}
          onChangeText={(text) => handleChange('email', text)}
          error={errors.email}
          keyboardType="email-address"
        />

        <Input
          label="Password"
          placeholder="••••••••"
          value={values.password}
          onChangeText={(text) => handleChange('password', text)}
          error={errors.password}
          secureTextEntry
        />

        <Button
          variant="primary"
          loading={isSubmitting}
          onPress={handleSubmit}
        >
          Create Account
        </Button>

        <Text style={styles.signinText}>
          Already have an account?{' '}
          <Text
            style={styles.signinLink}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  signinText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  signinLink: {
    color: '#2196F3',
    fontWeight: '600',
  },
});
