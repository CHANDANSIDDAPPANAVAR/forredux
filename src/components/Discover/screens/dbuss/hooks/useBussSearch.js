import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../../services/api';

const PAGE_SIZE = 25;

export const useBussSearch = () => {
  const [locations, setLocations] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const isFetchingRef = useRef(false);

  /* ---------- FETCH ---------- */
  const fetchBusinesses = useCallback(
    async ({ reset = false, keyword } = {}) => {
      if (!userLocation || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setLoading(true);

      try {
        const currentOffset = reset ? 0 : offset;

        const { data } = await api.get('/api/business/nearby', {
          params: {
            lat: userLocation.latitude,
            lng: userLocation.longitude,
            keywords: keyword || undefined,
            limit: PAGE_SIZE,
            offset: currentOffset,
          },
        });

        const list = Array.isArray(data?.businesses) ? data.businesses : [];

        setLocations(prev => (reset ? list : [...prev, ...list]));
        setOffset(currentOffset + PAGE_SIZE);
        setHasMore(list.length === PAGE_SIZE);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [userLocation, offset],
  );

  /* ---------- LOAD LOCATION ONLY ---------- */
  useEffect(() => {
    const loadLocation = async () => {
      const saved = await AsyncStorage.getItem('last_location');
      if (!saved) return;
      setUserLocation(JSON.parse(saved));
    };
    loadLocation();
  }, []);

  /* ---------- INITIAL FETCH (NO SEARCH) ---------- */
  useEffect(() => {
    if (userLocation) {
      fetchBusinesses({ reset: true });
    }
  }, [userLocation]);

  /* ---------- ACTIONS ---------- */
  const search = () => {
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    setOffset(0);
    setHasMore(true);

    fetchBusinesses({
      reset: true,
      keyword: searchQuery.trim(),
    });
  };

  const reset = () => {
    setHasSearched(false);
    setSearchQuery('');
    setOffset(0);
    setHasMore(true);

    fetchBusinesses({ reset: true });
  };

  const loadMore = () => {
    if (!hasMore || loading || isFetchingRef.current) return;

    fetchBusinesses({
      keyword: hasSearched ? searchQuery.trim() : undefined,
    });
  };

  return {
    locations,
    userLocation,
    loading,
    hasMore,

    searchQuery,
    setSearchQuery,

    hasSearched,
    search,
    reset,
    loadMore,
  };
};
