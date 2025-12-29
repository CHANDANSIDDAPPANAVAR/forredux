import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RegisterTypeScreen from '../components/register';
import ForgotPasswordScreen from '../components/forgotpass/frogetpass';
import VerifyResetOtpScreen from '../components/forgotpass/VerifyResetOtpScreen';
import SetNewPasswordScreen from '../components/forgotpass/setpassscreen';
import TLoginScreen from '../components/login/Login';
import MPRegistrationScreen from '../components/register/registerscreen';
import GOtpScreen from '../components/register/regotpscreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="register"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="register" component={RegisterTypeScreen} />
      <Stack.Screen name="Registerscreen" component={MPRegistrationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Login" component={TLoginScreen} />
      <Stack.Screen name="GOtp" component={GOtpScreen} />
      <Stack.Screen
        name="VerifyResetOtpScreen"
        component={VerifyResetOtpScreen}
      />
      <Stack.Screen
        name="SetNewPasswordScreen"
        component={SetNewPasswordScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
