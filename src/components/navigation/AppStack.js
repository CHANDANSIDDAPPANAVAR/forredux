import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import NotifyStack from './parts/notifystack';
import ProfileStack from './parts/ProfileStack';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* MAIN TABS */}
      <Stack.Screen name="AppTabs" component={MainTabs} />

      {/* GLOBAL SCREENS */}
      <Stack.Screen name="NotifyStack" component={NotifyStack} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
    </Stack.Navigator>
  );
};

export default AppStack;
