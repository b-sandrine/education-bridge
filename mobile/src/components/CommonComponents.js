import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export const Button = ({ children, variant = 'primary', loading = false, onPress, style = {} }) => {
  const variants = {
    primary: styles.primaryBtn,
    secondary: styles.secondaryBtn,
    danger: styles.dangerBtn,
  };

  return (
    <TouchableOpacity
      style={[variants[variant], style]}
      onPress={onPress}
      disabled={loading}
    >
      <Text style={styles.btnText}>{loading ? 'Loading...' : children}</Text>
    </TouchableOpacity>
  );
};

export const Input = ({ label, error, value, onChangeText, placeholder, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const Card = ({ children, style = {} }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

export const Alert = ({ type = 'info', message }) => {
  const colors = {
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
  };

  return (
    <View style={[styles.alert, { borderLeftColor: colors[type] }]}>
      <Text style={{ color: colors[type] }}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryBtn: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerBtn: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  alert: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
});
