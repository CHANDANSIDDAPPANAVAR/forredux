import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../../services/api';

const PAGE_SIZE = 25;

export const useNearbySearch = () => {
  const [distance, setDistance] = useState(5);
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const readableDistance =
    distance < 1
      ? `${Math.round(distance * 1000)} meters`
      : `${distance.toFixed(1)} km`;

  /* -------- Fetch Nearby -------- */
  const fetchNearby = useCallback(
    async ({ reset = false, applyRadius = false } = {}) => {
      if (!userLocation || loading) return;

      setLoading(true);

      try {
        const currentOffset = reset ? 0 : offset;

        const params = {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          limit: PAGE_SIZE,
          offset: currentOffset,
        };

        // radius ONLY on user search
        if (applyRadius) {
          params.radius = distance;
        }

        const { data } = await api.get('/api/opennetwork/nearby', { params });

        const users = data?.users || [];

        setLocations(prev => (reset ? users : [...prev, ...users]));
        setOffset(currentOffset + PAGE_SIZE);
        setHasMore(users.length === PAGE_SIZE);

        if (applyRadius && reset) {
          setShowAlert(true);
        }
      } catch (err) {
        console.error('[Nearby Fetch Error]', err);
      } finally {
        setLoading(false);
      }
    },
    [userLocation, distance, offset, loading],
  );

  /* -------- Load Saved Location ONLY -------- */
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const saved = await AsyncStorage.getItem('last_location');
        if (saved) {
          setUserLocation(JSON.parse(saved));
        }
      } catch (err) {
        console.error('[Location Load Error]', err);
      }
    };

    loadLocation();
  }, []);

  /* -------- INITIAL FETCH (no radius) -------- */
  useEffect(() => {
    if (userLocation) {
      fetchNearby({ reset: true, applyRadius: false });
    }
  }, [userLocation]);

  return {
    distance,
    setDistance,
    locations,
    userLocation,
    loading,
    hasMore,
    readableDistance,
    showAlert,
    setShowAlert,

    // explicit user actions
    search: () => fetchNearby({ reset: true, applyRadius: true }),
    loadMore: () => fetchNearby({ reset: false, applyRadius: true }),
  };
};
