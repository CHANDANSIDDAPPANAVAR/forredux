import api from '../../../../../services/api';
import {
  getProfileFromCache,
  getLastUpdatedFromCache,
  saveProfileToCache,
  saveLastUpdatedToCache,
} from './Asystore';

/**
 * Fetch profile data using cache + HEAD validation
 * Fetches full data only if cache is stale
 *
 * @param {string} accessToken
 * @returns {Promise<object|null>}
 */
export const fetchAndCacheProfile = async accessToken => {
  console.log('🚀 fetchAndCacheProfile called');

  const cachedProfile = await getProfileFromCache();
  const cachedUpdatedAt = await getLastUpdatedFromCache();

  console.log('📦 Cached profile:', cachedProfile ? 'FOUND' : 'NOT FOUND');
  console.log('🕓 Cached updated_at:', cachedUpdatedAt);

  try {
    console.log('🔍 Sending HEAD request to check updated_at');

    const headRes = await api.head('/api/user/profiledata', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const serverUpdatedAt = headRes.headers['x-profile-updated-at'];
    console.log('🕓 Server updated_at:', serverUpdatedAt);

    const isStale =
      !cachedUpdatedAt ||
      !serverUpdatedAt ||
      serverUpdatedAt !== cachedUpdatedAt;

    console.log('🧠 Cache stale?', isStale);

    // ✅ Use cache
    if (!isStale && cachedProfile) {
      console.log('✅ Using cached profile (no GET request)');
      return cachedProfile;
    }

    // 🌐 Fetch from server
    console.log('🌐 Cache stale → fetching full profile from server');

    const fullRes = await api.get('/api/user/profiledata', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = fullRes.data;
    const updatedAt = data.updated_at || new Date().toISOString();

    console.log('✅ Profile fetched from server');
    console.log('💾 Saving profile to cache');
    console.log('🕓 Saving updated_at:', updatedAt);

    await saveProfileToCache(data);
    await saveLastUpdatedToCache(updatedAt);

    return data;
  } catch (err) {
    console.warn('⚠️ Error during HEAD/GET request:', err?.message);

    if (cachedProfile) {
      console.log('🛟 Falling back to cached profile');
    } else {
      console.log('❌ No cached profile available');
    }

    return cachedProfile;
  }
};
