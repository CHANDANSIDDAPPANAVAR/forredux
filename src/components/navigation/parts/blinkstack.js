import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Blink from '../../Blink/blink';

const Stack = createNativeStackNavigator();

const BlinkStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Blink" component={Blink} />
    </Stack.Navigator>
  );
};

export default BlinkStack;
