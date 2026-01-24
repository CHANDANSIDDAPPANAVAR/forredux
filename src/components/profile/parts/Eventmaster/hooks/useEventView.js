import { useEffect, useState } from 'react';
import api from '../../../../../services/api';

export const useEventView = event_id => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!event_id) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);

        const cleanId = event_id.trim().toLowerCase().replace(/\s+/g, '');
        const res = await api.get(`/api/events/${cleanId}`);

        setEvent(res.data?.event || null);
      } catch (e) {
        setError(e?.response?.data || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id]);

  return { loading, event, error };
};
