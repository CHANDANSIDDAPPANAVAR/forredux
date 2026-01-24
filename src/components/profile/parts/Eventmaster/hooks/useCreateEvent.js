import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../../../../../services/api';

export const useCreateEvent = ({ onCreated, onClose }) => {
  const [eventId, setEventId] = useState('');
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);

  const checkAvailability = useCallback(async id => {
    if (!id?.trim()) return;

    setChecking(true);
    try {
      const res = await api.get(`/api/events/check-name?name=${id.trim()}`);
      setIsAvailable(!res?.data?.exists);
    } catch {
      setIsAvailable(null);
    } finally {
      setChecking(false);
    }
  }, []);

  const onChangeEventId = text => {
    setEventId(text);
    setIsAvailable(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkAvailability(text);
    }, 500);
  };

  const createEvent = async () => {
    const trimmed = eventId.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const check = await api.get(`/api/events/check-name?name=${trimmed}`);

      if (check?.data?.exists) {
        setIsAvailable(false);
        return;
      }

      const res = await api.post('/api/events/create-initial', {
        event_id: trimmed,
      });

      if (res.status === 201) {
        setEventId('');
        setIsAvailable(null);
        onCreated?.();
        onClose?.();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    eventId,
    isAvailable,
    checking,
    loading,
    onChangeEventId,
    createEvent,
    isDisabled: loading || checking || isAvailable === false || !eventId.trim(),
  };
};
