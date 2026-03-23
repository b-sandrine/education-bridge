import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './store';
import { AppStack, LoginStack } from './navigation/Navigation';
import { useAuth } from './hooks/useAppStore';
import { useDispatch } from 'react-redux';
import { restoreToken } from './store/authSlice';

const Navigator = () => {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        if (savedToken) {
          dispatch(restoreToken(savedToken));
        }
      } catch (error) {
        console.error('Failed to restore token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {token ? <AppStack /> : <LoginStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
