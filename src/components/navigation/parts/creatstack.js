import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import create from '../../Create/create';

const Stack = createNativeStackNavigator();

const createStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Profile"
        component={create}
        screenOptions={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default createStack;
