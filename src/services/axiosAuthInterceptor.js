// src/services/axiosAuthInterceptor.js
// when if need skip use this s api.get('/api/check-session', { skipAuth: true });

import api from './api';
import { store } from '../store';
import { refreshTokenThunk, logoutThunk } from '../store/auth/authThunks';

let isRefreshing = false;
let failedQueue = [];

/* ======================================
   PROCESS QUEUED REQUESTS
====================================== */
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

/* ======================================
   REQUEST INTERCEPTOR
   - Attaches access token automatically
====================================== */
api.interceptors.request.use(
  config => {
    const { accessToken } = store.getState().auth;

    // allow manual skip if ever needed
    if (accessToken && !config.skipAuth) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

/* ======================================
   RESPONSE INTERCEPTOR
   - Handles token refresh
   - Handles forced logout
====================================== */
api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    // 🚫 No response or already retried
    if (!error.response || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // 🔐 Only handle auth failures
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // ⏳ If refresh already in progress, queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // 🔁 Attempt token refresh
      const newAccessToken = await store.dispatch(refreshTokenThunk()).unwrap();

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (err) {
      // ❌ Refresh failed → force logout
      processQueue(err, null);
      store.dispatch(logoutThunk());
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
