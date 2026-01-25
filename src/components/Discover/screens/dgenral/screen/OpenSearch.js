import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useNearbySearch } from '../hooks/useNearbySearch';
import LocationList from './LocationList';
import DistanceSlider from '../util/DistanceSlider';
import NearbyAlert from '../util/NearbyAlert';

const OpenSearch = () => {
  const {
    distance,
    setDistance,
    locations,
    userLocation,
    loading,
    hasMore,
    readableDistance,
    showAlert,
    setShowAlert,
    search,
    loadMore,
  } = useNearbySearch();

  // 👇 key to reset slider
  const [resetKey, setResetKey] = useState(0);

  // 🔁 runs every time screen is focused
  useFocusEffect(
    useCallback(() => {
      setResetKey(k => k + 1);
    }, []),
  );

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Unable to fetch location.</Text>
      </View>
    );
  }

  if (loading && locations.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
        <Text>Loading nearby users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <NearbyAlert
        visible={showAlert}
        readableDistance={readableDistance}
        onClose={() => setShowAlert(false)}
      />

      {/* ✅ Slider + Search in one row */}
      <DistanceSlider
        distance={distance}
        setDistance={setDistance}
        onSearch={search}
        resetKey={resetKey} // 👈 IMPORTANT
      />

      <LocationList
        locations={locations}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </View>
  );
};

export default OpenSearch;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
  },
});
