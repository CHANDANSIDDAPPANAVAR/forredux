import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import AppStack from './AppStack';
import Login from '../Auth/login/login';
import TLoginScreen from '../Auth/auth/components/login/Login';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  //🔄 While restoring session from Keychain
  if (loading) {
    return null; // or SplashScreen component
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="App" component={AppStack} />
      ) : (
        <Stack.Screen name="Auth" component={TLoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
