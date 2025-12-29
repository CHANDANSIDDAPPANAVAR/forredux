import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeMain from '../../Home/HomeMain';
import Header from '../../Home/parts/Heder';
import NotifyStack from './notifystack';
import ProfileStack from './ProfileStack';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeMain}
        options={{
          header: () => <Header />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
