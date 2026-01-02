// services/mediaUrl.js
import { API_BASE_URL } from '@env';

export const MEDIA_BASE_URL = API_BASE_URL.replace(/\/$/, '');

export const resolveMediaUrl = url => {
  if (!url || typeof url !== 'string') return null;

  // Absolute URL
  if (url.startsWith('http')) {
    return url.includes('localhost')
      ? url.replace('localhost', '10.0.2.2') // Android emulator
      : url;
  }

  // Relative path
  return `${MEDIA_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};
