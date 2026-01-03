import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from '../../Chat/chat';
import Header from '../../Home/parts/Heder';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          header: () => <Header />,
        }}
      />
    </Stack.Navigator>
  );
};

export default ChatStack;
