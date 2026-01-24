import { useCallback, useEffect, useState } from 'react';
import api from '../../../../../services/api';

export const useMyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get('/api/events/my-events');
      setEvents(res?.data?.events ?? []);
    } catch {
      setError('Unable to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    refresh: fetchEvents,
  };
};
