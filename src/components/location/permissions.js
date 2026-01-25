import { Platform, PermissionsAndroid } from 'react-native';

export const requestLocationPermissions = async () => {
  if (Platform.OS === 'android') {
    const fine = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }

    // Android 10+ background permission
    if (Platform.Version >= 29) {
      const bg = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      );

      return bg === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  }

  // iOS → permission popup is handled automatically by Geolocation
  return true;
};
