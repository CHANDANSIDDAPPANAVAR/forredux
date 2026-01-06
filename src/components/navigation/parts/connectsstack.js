// navigation/parts/connectsstack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConnectsHome from '../../Connects/connects';

import Header from '../../Home/parts/Heder';
import Followingopen from '../../Connects/components/screens/Genral/profile/followingGprofile';
import ConnectProffopen from '../../Connects/components/screens/proff/profile/followingproffprofile';
import ConnectServiceopen from '../../Connects/components/screens/sevr/profile/followingServprofile';
import Bussconneted from '../../Connects/components/screens/buss/profile/followingprofile';

const Stack = createNativeStackNavigator();

const ConnectsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

      <Stack.Screen
        name="Connectproffopen"
        component={ConnectProffopen}
        options={{
          tabBarStyle: { display: 'none' },
        }}
      />
      <Stack.Screen
        name="ConnectServiceopen"
        component={ConnectServiceopen}
        options={{
          tabBarStyle: { display: 'none' },
        }}
      />

      <Stack.Screen
        name="ConnectBussopen"
        component={Bussconneted}
        options={{
          tabBarStyle: { display: 'none' },
        }}
      />
    </Stack.Navigator>
  );
};

export default ConnectsStack;
