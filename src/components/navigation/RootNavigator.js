import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import AppStack from './AppStack';
import TLoginScreen from '../Auth/auth/components/login/Login';
import SplashScreen from './parts/SplashScreen';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { loading, bootstrapped, isAuthenticated } = useSelector(
    state => state.auth,
  );

  // ✅ SAFE LOGGING
  useEffect(() => {
    console.log('🔄 Auth loading:', loading);
    console.log('🔐 isAuthenticated:', isAuthenticated);
  }, [loading, isAuthenticated]);

  // 🔄 While restoring session from Keychain
  if (!bootstrapped) {
    return <SplashScreen />; // 👈 GUARANTEED
  }
  console.log(
    isAuthenticated ? '🟢 Rendering AppStack' : '🟡 Rendering AuthStack',
  );

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
