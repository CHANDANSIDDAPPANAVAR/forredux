import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LocationTracker from './LocationTracker';

const LocationStatusScreen = () => {
  const trackerRef = useRef(null);

  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  /* -------------------- LOAD LAST SAVED LOCATION -------------------- */
  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    const stored = await AsyncStorage.getItem('last_location');
    if (stored) {
      const { latitude, longitude } = JSON.parse(stored);
      setLocation({ latitude, longitude });
    }
  };

  /* -------------------- MANUAL REFRESH -------------------- */
  const refreshLocation = async () => {
    trackerRef.current?.forceUpdate();

    // small delay to allow GPS + save
    setTimeout(loadLocation, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Hidden tracker instance */}
      <LocationTracker ref={trackerRef} />

      <Text style={styles.title}>Current Location</Text>

      <View style={styles.box}>
        <Text style={styles.value}>Latitude: {location.latitude ?? '--'}</Text>
        <Text style={styles.value}>
          Longitude: {location.longitude ?? '--'}
        </Text>
      </View>

      <Button title="Refresh Location" onPress={refreshLocation} />
    </View>
  );
};

export default LocationStatusScreen;

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  box: {
    width: '80%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    marginVertical: 4,
  },
});
