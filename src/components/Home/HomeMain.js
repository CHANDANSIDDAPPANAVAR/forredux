import React, { useRef } from 'react';
import { View, Text, BackHandler, Platform, ToastAndroid } from 'react-native';
import useAndroidBackHandler from '../navigation/util/useBackToHome';
import QRCard from './center/centercard';

const HomeMain = () => {
  const lastBackPress = useRef(0);

  useAndroidBackHandler(() => {
    const now = Date.now();

    if (now - lastBackPress.current < 2000) {
      BackHandler.exitApp();
    } else {
      lastBackPress.current = now;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
    }
  });

  return <QRCard />;
};

export default HomeMain;
