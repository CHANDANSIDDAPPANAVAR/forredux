import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useAndroidBackHandler from '../navigation/util/useBackToHome';

const Chat = () => {
  const navigation = useNavigation();
  useAndroidBackHandler(() => {
    navigation.navigate('HomeTab');
  });

  return (
    <SafeAreaView>
      <Text>Chat</Text>
    </SafeAreaView>
  );
};

export default Chat;
