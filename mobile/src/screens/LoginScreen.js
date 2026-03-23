import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm } from '../hooks/useForm';
import { authAPI } from '../services/api';
import { loginSuccess } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input, Card, Alert } from '../components/CommonComponents';

export const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    async (values) => {
      setServerError(null);
      try {
        const response = await authAPI.login(values.email, values.password);
        dispatch(loginSuccess(response.data.data));
        await AsyncStorage.setItem('token', response.data.data.token);
        navigation.navigate('Dashboard');
      } catch (error) {
        const message = error.response?.data?.message || 'Login failed';
        setServerError(message);
      }
    }
  );

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Sign In</Text>

        {serverError && <Alert type="error" message={serverError} />}

        <Input
          label="Email"
          placeholder="your@email.com"
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
          Sign In
        </Button>

        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => navigation.navigate('Register')}
          >
            Register
          </Text>
        </Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    color: '#2196F3',
    fontWeight: '600',
  },
});
