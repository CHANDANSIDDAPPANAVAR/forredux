// src/utils/safeAlert.js
import { Alert, AppState, Platform } from 'react-native';

export function safeAlert(title, message, buttons = []) {
  if (Platform.OS === 'android' && AppState.currentState !== 'active') {
    return; // 🚫 prevent crash
  }

  Alert.alert(title, message, buttons);
}
