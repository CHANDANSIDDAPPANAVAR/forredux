import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connects from '../../Connects/connects';
import Header from '../../Home/parts/Heder';

const Stack = createNativeStackNavigator();

const ConnectsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Connects"
        component={Connects}
        options={{
          header: () => <Header />,
        }}
      />
    </Stack.Navigator>
  );
};

export default ConnectsStack;
