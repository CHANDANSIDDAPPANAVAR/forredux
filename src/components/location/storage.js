import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'last_location';

export const saveLocation = async (latitude, longitude) => {
  await AsyncStorage.setItem(KEY, JSON.stringify({ latitude, longitude }));
};

export const getLastLocation = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};
