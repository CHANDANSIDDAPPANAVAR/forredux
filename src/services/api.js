// services/api.js
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';

export const getBaseUrl = () => ENV_API_BASE_URL;
console.log('API_BASE_URL:', ENV_API_BASE_URL);

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ===========================
   REQUEST INTERCEPTOR
   (NETWORK CHECK ONLY)
=========================== */
api.interceptors.request.use(
  async config => {
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      return Promise.reject({
        isNetworkError: true,
        message: 'No internet connection',
      });
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ===========================
   RESPONSE INTERCEPTOR
   (PASS THROUGH ONLY)
=========================== */
api.interceptors.response.use(
  response => response,
  error => Promise.reject(error),
);

export default api;
