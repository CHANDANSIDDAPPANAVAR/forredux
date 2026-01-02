import { Platform, ToastAndroid } from 'react-native';

let showIOSToast = null;

export const registerToast = fn => {
  showIOSToast = fn;
};

export const showToast = message => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    showIOSToast?.(message);
  }
};
