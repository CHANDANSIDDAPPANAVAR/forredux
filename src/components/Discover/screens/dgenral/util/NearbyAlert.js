import React, { memo } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';

const { width } = Dimensions.get('window');

const NearbyAlert = ({ visible, onClose, readableDistance }) => {
  if (!visible) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.alertBox}>
          <Text style={styles.title}>✅ Nearby Results</Text>

          <Text style={styles.message}>
            Showing locations within{' '}
            <Text style={styles.highlight}>{readableDistance}</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Okay</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default memo(NearbyAlert);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.82,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5271ff',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 20,
  },
  highlight: {
    fontWeight: '600',
    color: '#000',
  },
  button: {
    backgroundColor: '#5271ff',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
