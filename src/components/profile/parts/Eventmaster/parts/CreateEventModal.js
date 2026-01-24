import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { useCreateEvent } from '../hooks/useCreateEvent';

const CreateEventModal = ({ visible, onClose, onCreated }) => {
  const {
    eventId,
    isAvailable,
    checking,
    loading,
    onChangeEventId,
    createEvent,
    isDisabled,
  } = useCreateEvent({ onCreated, onClose });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Create New Event</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter event ID"
            value={eventId}
            onChangeText={onChangeEventId}
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          {checking && <Text style={styles.info}>Checking availability…</Text>}
          {isAvailable === true && (
            <Text style={styles.success}>✓ Available</Text>
          )}
          {isAvailable === false && (
            <Text style={styles.error}>✕ Already taken</Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={createEvent}
              disabled={isDisabled}
              style={[styles.confirm, isDisabled && { opacity: 0.6 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateEventModal;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  info: {
    marginTop: 8,
    color: '#666',
  },
  success: {
    marginTop: 8,
    color: '#2ecc71',
    fontWeight: '600',
  },
  error: {
    marginTop: 8,
    color: '#e74c3c',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancel: {
    marginRight: 16,
  },
  cancelText: {
    color: '#888',
    fontWeight: '600',
  },
  confirm: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});
