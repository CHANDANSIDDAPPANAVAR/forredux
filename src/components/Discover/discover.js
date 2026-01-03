import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAndroidBackHandler from '../navigation/util/useBackToHome';

const Discover = () => {
  const navigation = useNavigation();

  useAndroidBackHandler(() => {
    navigation.navigate('HomeTab');
  });

  return (
    <View>
      <Text>Discover</Text>
    </View>
  );
};

export default Discover;
