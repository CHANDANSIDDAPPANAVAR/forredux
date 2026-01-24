import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import LocationPicker from '../../../identity/Eparts/Components/Opennetwork/LocationPicker';

const VisibilitySection = ({
  pickedLocation,
  setPickedLocation,
  modalVisible,
  openModal,
  closeModal,
  handleLocation,
}) => {
  const handleViewOnMap = () => {
    if (!pickedLocation) return;

    const { latitude, longitude } = pickedLocation;
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nearby Discovery Location</Text>
      <Text style={styles.helper}>
        Add an approximate location so people nearby can discover your event
      </Text>

      {pickedLocation ? (
        <View style={styles.card}>
          <Text style={styles.coords}>
            Lat {pickedLocation.latitude.toFixed(5)} · Lon{' '}
            {pickedLocation.longitude.toFixed(5)}
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={handleViewOnMap}
              style={styles.secondaryBtn}
            >
              <Text style={styles.secondaryText}>View on Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPickedLocation(null)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={openModal} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Pick Location from Maps</Text>
        </TouchableOpacity>
      )}

      <Modal visible={modalVisible} animationType="slide">
        <LocationPicker
          onLocationSelected={location => {
            handleLocation(location);
          }}
          onCancel={closeModal}
        />
      </Modal>
    </View>
  );
};

export default VisibilitySection;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#111',
    marginLeft: 4,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  coords: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#fff',
    fontSize: 13,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
});
