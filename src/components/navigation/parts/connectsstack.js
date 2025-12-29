import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connects from '../../Connects/connects';

const Stack = createNativeStackNavigator();

const ConnectsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Connects" component={Connects} />
    </Stack.Navigator>
  );
};

export default ConnectsStack;
