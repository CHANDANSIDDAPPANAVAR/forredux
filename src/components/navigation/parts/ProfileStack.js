import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../profile/profile';
import Logout from '../../profile/parts/logout/logout';

const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MLogout" component={Logout} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
