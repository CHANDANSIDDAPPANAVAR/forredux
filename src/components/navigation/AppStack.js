import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabs from './MainTabs';
import NotifyStack from './parts/notifystack';
import ProfileStack from './parts/ProfileStack';
import ConnectsStack from './parts/connectsstack';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppTabs" component={MainTabs} />
      <Stack.Screen name="NotifyStack" component={NotifyStack} />
      <Stack.Screen name="ProfileStack" component={ProfileStack} />
      <Stack.Screen name="Connects" component={ConnectsStack} />
    </Stack.Navigator>
  );
};

export default AppStack;
