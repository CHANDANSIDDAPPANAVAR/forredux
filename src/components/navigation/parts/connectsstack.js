// navigation/parts/connectsstack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectsHome from '../../Connects/connects';

import Header from '../../Home/parts/Heder';
import Followingopen from '../../Connects/components/screens/Genral/profile/followingGprofile';

const Stack = createNativeStackNavigator();

const ConnectsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConnectsHome"
        component={ConnectsHome}
        options={{ header: () => <Header /> }}
      />
      <Stack.Screen
        name="Followingopen"
        component={Followingopen}
        options={{
          tabBarStyle: { display: 'none' },
        }}
      />
    </Stack.Navigator>
  );
};

export default ConnectsStack;
