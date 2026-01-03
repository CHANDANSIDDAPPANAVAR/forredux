import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Discover from '../../Discover/discover';
import Header from '../../Home/parts/Heder';

const Stack = createNativeStackNavigator();

const DiscoverStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Discover"
        component={Discover}
        options={{
          header: () => <Header />,
        }}
      />
    </Stack.Navigator>
  );
};

export default DiscoverStack;
