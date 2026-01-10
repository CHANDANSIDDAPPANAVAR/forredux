import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LocationPicker({ onLocationSelected, onCancel }) {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initLocation();
  }, []);

  const initLocation = async () => {
    try {
      const saved = await AsyncStorage.getItem('saved_location');

      if (saved) {
        const parsed = JSON.parse(saved);
        const initialRegion = {
          ...parsed,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(initialRegion);
        setMarker(parsed);
        setLoading(false);
        return;
      }
    } catch {}

    requestLiveLocation();
  };

  const requestLiveLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLoading(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const initialRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(initialRegion);
          setMarker({ latitude, longitude });
          setLoading(false);
        },
        () => setLoading(false),
        { enableHighAccuracy: true, timeout: 15000 },
      );
    } catch {
      setLoading(false);
    }
  };

  const onMapPress = e => {
    setMarker(e.nativeEvent.coordinate);
  };

  const handleSave = async () => {
    if (!marker) {
      return;
    }
    await AsyncStorage.setItem('saved_location', JSON.stringify(marker));
    onLocationSelected(marker);
  };

  if (loading || !region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={onMapPress}
        onRegionChangeComplete={setRegion}
        showsUserLocation
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      {marker && (
        <Text style={styles.coords}>
          Lat: {marker.latitude.toFixed(6)} | Lon: {marker.longitude.toFixed(6)}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coords: {
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 6,
    color: '#333',
  },
  actions: {
    padding: 10,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveText: { color: '#fff', fontWeight: '600' },
  cancelBtn: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelText: { color: '#333' },
});
