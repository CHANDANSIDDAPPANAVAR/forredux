import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../../../../services/api';
const PROFILE_KEY = 'cached_profile';
const UPDATED_KEY = 'profile_updated_at';

export const saveProfileToCache = async profile => {
  try {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile to cache:', e);
  }
};

export const getProfileFromCache = async () => {
  try {
    const cached = await AsyncStorage.getItem(PROFILE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    console.error('Error reading profile from cache:', e);
    return null;
  }
};

export const saveLastUpdatedToCache = async timestamp => {
  try {
    await AsyncStorage.setItem(UPDATED_KEY, timestamp);
  } catch (e) {
    console.error('Error saving updated_at to cache:', e);
  }
};

export const getLastUpdatedFromCache = async () => {
  try {
    return await AsyncStorage.getItem(UPDATED_KEY);
  } catch (e) {
    console.error('Error reading updated_at from cache:', e);
    return null;
  }
};
export const clearProfileCache = async () => {
  try {
    await AsyncStorage.multiRemove([PROFILE_KEY, UPDATED_KEY]);
    console.log('🧹 Cleared profile cache');
  } catch (e) {
    console.error('❌ Failed to clear profile cache:', e);
  }
};

export const getFreshProfileFromCache = async accessToken => {
  console.log('🔍 Checking if cached profile is fresh...');

  let cached = null;
  let cachedUpdatedAt = null;

  try {
    cached = await AsyncStorage.getItem(PROFILE_KEY);
    cachedUpdatedAt = await AsyncStorage.getItem(UPDATED_KEY);

    if (!cached) {
      console.log('📦 No cached profile found.');
      return null;
    }

    console.log('📦 Cached profile found.');
    console.log('🕓 Cached updated_at:', cachedUpdatedAt);

    const res = await api.head('/api/user/profiledata', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const serverUpdatedAt = res.headers['x-profile-updated-at'];
    console.log('🕓 Server updated_at:', serverUpdatedAt);

    if (!cachedUpdatedAt || serverUpdatedAt !== cachedUpdatedAt) {
      console.log('⚠️ Cache is stale or missing updated_at. Needs refresh.');
      return null;
    }

    console.log('✅ Cache is fresh. Using cached profile.');
    return JSON.parse(cached);
  } catch (e) {
    console.warn('⚠️ HEAD check failed or error occurred:', e.message);

    try {
      if (cached) {
        console.log('📦 Using fallback cached profile due to error.');
        return JSON.parse(cached);
      } else {
        console.log('❌ No cached profile available as fallback.');
        return null;
      }
    } catch (parseError) {
      console.error('❌ Failed to parse cached profile:', parseError.message);
      return null;
    }
  }
};

export const fetchAndCacheProfile = async accessToken => {
  console.log('🌐 Fetching fresh profile from server...');

  try {
    const res = await api.get('/api/user/profiledata', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = res.data;
    const updatedAt = data.updated_at || new Date().toISOString();

    console.log('✅ Profile fetched from server.');
    console.log('💾 Caching profile...');

    await saveProfileToCache(data);
    await saveLastUpdatedToCache(updatedAt);

    console.log('🗃️ Profile cached successfully with updated_at:', updatedAt);

    return data;
  } catch (e) {
    console.error('❌ Failed to fetch profile from server:', e.message);
    throw e;
  }
};
