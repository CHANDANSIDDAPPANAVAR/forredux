import { useRef, useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const useAndroidBackHandler = handler => {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') {
        return () => {}; // 👈 always return cleanup
      }

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handlerRef.current?.();
          return true; // ✅ ALWAYS handled
        },
      );

      return () => {
        subscription.remove();
      };
    }, []),
  );
};

export default useAndroidBackHandler;
