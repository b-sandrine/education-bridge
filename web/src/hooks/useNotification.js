import React from 'react';
import { Toast } from 'react-toastify';

export const useNotification = () => {
  const showSuccess = (message) => {
    Toast.success(message);
  };

  const showError = (message) => {
    Toast.error(message);
  };

  const showInfo = (message) => {
    Toast.info(message);
  };

  const showWarning = (message) => {
    Toast.warning(message);
  };

  return { showSuccess, showError, showInfo, showWarning };
};
