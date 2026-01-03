import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAndroidBackHandler from '../navigation/util/useBackToHome'; // if you still want it
import ConMainLayout from './layout/connactsmainlay';

const Connects = () => {
  const navigation = useNavigation();

  // Optional: extra safety if you keep the custom hook
  useAndroidBackHandler(() => {
    navigation.navigate('HomeTab');
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ConMainLayout />
    </View>
  );
};

export default Connects;
