import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import api from '../../../../../services/api';

export const useMyEventActions = onRefresh => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const openMenu = useCallback((eventId, nativeEvent) => {
    const { pageX, pageY } = nativeEvent;
    setMenuPosition({ x: pageX, y: pageY });
    setSelectedEventId(eventId);
    setMenuVisible(true);
  }, []);

  const closeMenu = () => setMenuVisible(false);

  const deleteEvent = async eventId => {
    try {
      await api.delete(`/api/events/${eventId}`);
      onRefresh?.();
    } catch {
      Alert.alert('Error', 'Could not delete event');
    }
  };

  const confirmDelete = () => {
    if (!selectedEventId) return;

    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteEvent(selectedEventId),
      },
    ]);

    closeMenu();
  };

  return {
    menuVisible,
    menuPosition,
    openMenu,
    closeMenu,
    confirmDelete,
  };
};
