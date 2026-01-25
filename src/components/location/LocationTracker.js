import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { AppState, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';

import { requestLocationPermissions } from './permissions';
import { saveLocation, getLastLocation } from './storage';
import { getDistanceInMeters } from './distance';
import { initBackgroundFetch } from './backgroundFetch';
import api from '../../services/api';

const LOCATION_MIN_DISTANCE = 20;

const LocationTracker = forwardRef((_, ref) => {
  const lastRef = useRef(null);
  const fetchingRef = useRef(false);

  const { userAccountType, userShownearby } = useSelector(state => state.auth);

  useEffect(() => {
    start();
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') start();
    });
    return () => sub.remove();
  }, []);

  const start = async () => {
    const granted = await requestLocationPermissions();
    if (!granted) return;

    lastRef.current = await getLastLocation();
    fetchLocation();
    initBackgroundFetch(fetchLocation);
  };

  const fetchLocation = () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    Geolocation.getCurrentPosition(
      pos => {
        handlePosition(pos).finally(() => {
          fetchingRef.current = false;
        });
      },
      () => {
        fetchingRef.current = false;
      },
      {
        enableHighAccuracy: Platform.OS === 'android',
        timeout: 10000,
        maximumAge: 5000,
      },
    );
  };

  const handlePosition = async pos => {
    const { latitude, longitude } = pos.coords;

    if (lastRef.current) {
      const distance = getDistanceInMeters(
        lastRef.current.latitude,
        lastRef.current.longitude,
        latitude,
        longitude,
      );

      if (distance < LOCATION_MIN_DISTANCE) return;
    }

    await saveLocation(latitude, longitude);
    lastRef.current = { latitude, longitude };

    if (userAccountType === 'OPEN_NETWORK' && userShownearby) {
      await api.post('/api/update-location', {
        latitude,
        longitude,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    forceUpdate: fetchLocation,
  }));

  return null;
});

export default LocationTracker;
