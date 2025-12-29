import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Notify from '../../notify/notify';

const Stack = createNativeStackNavigator();

const NotifyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notify" component={Notify} />
    </Stack.Navigator>
  );
};

export default NotifyStack;
