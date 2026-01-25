import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DiscoverHome from '../../Discover/discover';

const Stack = createNativeStackNavigator();

const DiscoverStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Discover" component={DiscoverHome} />
    </Stack.Navigator>
  );
};

export default DiscoverStack;
