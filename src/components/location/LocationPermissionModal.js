import React from 'react';
import { Modal, View, Text, Button, StyleSheet, Linking } from 'react-native';

const LocationPermissionModal = ({ visible, onClose }) => {
  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Enable Location Access</Text>

          <Text style={styles.text}>
            To show nearby users and places, please allow location access as
            "Always".
          </Text>

          <Button title="Open Settings" onPress={Linking.openSettings} />
          <View style={{ height: 10 }} />
          <Button title="Later" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default LocationPermissionModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#0006',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 20,
  },
});
