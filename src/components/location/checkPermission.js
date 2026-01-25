import { Platform } from 'react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const checkLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const status = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);

    return {
      isAlways: status === RESULTS.GRANTED,
      status,
    };
  }

  // Android
  const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

  return {
    isAlways: status === RESULTS.GRANTED,
    status,
  };
};
