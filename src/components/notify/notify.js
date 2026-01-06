import React, { useCallback } from 'react';
import { Text, View, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const Notify = () => {
  const navigation = useNavigation();
  /* Android back → HomeStack */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'AppTabs' }],
        });
        return true; // ⛔ stop Android from closing app
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [navigation]),
  );

  return (
    <SafeAreaView>
      <Text>Notify</Text>
    </SafeAreaView>
  );
};

export default Notify;
