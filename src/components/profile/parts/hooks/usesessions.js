// src/hooks/useSessions.js
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../../../../services/api';
import {
  currentLogoutThunk,
  logoutAllThunk,
} from '../../../../store/auth/authThunks';

export function useSessions() {
  const dispatch = useDispatch();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = useCallback(
    err => {
      if (err.response?.status === 401) {
        dispatch(currentLogoutThunk());
      } else if (!err.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to load sessions.');
      }
    },
    [dispatch],
  );

  /* =========================
     FETCH ACTIVE SESSIONS
  ========================= */
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/sessions');
      setSessions(res.data || []);
      setError(null);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  /* =========================
     LOGOUT SPECIFIC SESSION
  ========================= */
  const logoutSession = useCallback(
    async sessionId => {
      try {
        await api.post(`/api/singlesessions/${sessionId}`);
        setSessions(prev => prev.filter(item => item.sessionId !== sessionId));
      } catch (err) {
        handleError(err);
      }
    },
    [handleError],
  );

  /* =========================
     LOGOUT CURRENT DEVICE
  ========================= */
  const logoutCurrent = useCallback(() => {
    dispatch(currentLogoutThunk());
  }, [dispatch]);

  /* =========================
     LOGOUT ALL DEVICES
  ========================= */
  const logoutAll = useCallback(() => {
    dispatch(logoutAllThunk());
  }, [dispatch]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    loading,
    error,
    logoutSession,
    logoutCurrent,
    logoutAll,
  };
}
