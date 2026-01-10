import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
} from 'react-native';
import LocationPicker from './LocationPicker';

export default function LocationSection({
  pickedLocation,
  pickedAddress,
  setPickedLocation,
  setPickedAddress,
  modalVisible,
  openModal,
  closeModal,
}) {
  const handleViewOnMap = async () => {
    if (!pickedLocation?.latitude || !pickedLocation?.longitude) return;

    const { latitude, longitude } = pickedLocation;

    try {
      if (Platform.OS === 'ios') {
        const googleMapsAppUrl = `comgooglemaps://?q=${latitude},${longitude}`;
        const appleMapsUrl = `maps://?q=${latitude},${longitude}`;
        const googleMapsWebUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        if (await Linking.canOpenURL(googleMapsAppUrl)) {
          await Linking.openURL(googleMapsAppUrl);
        } else if (await Linking.canOpenURL(appleMapsUrl)) {
          await Linking.openURL(appleMapsUrl);
        } else {
          await Linking.openURL(googleMapsWebUrl);
        }
      } else {
        // Android: Google Maps app handles this automatically if installed
        const googleMapsAppUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
        await Linking.openURL(googleMapsAppUrl);
      }
    } catch {
      Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`);
    }
  };

  const handleDeleteLocation = () => {
    setPickedLocation(null);
  };

  const handleClearAddress = () => {
    setPickedAddress('');
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Address</Text>

      <View style={styles.addressBox}>
        <TextInput
          style={styles.addressInput}
          placeholder="Enter address"
          value={pickedAddress}
          onChangeText={setPickedAddress}
          multiline
        />
        <TouchableOpacity onPress={handleClearAddress}>
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Google Maps Location</Text>

      <Text style={styles.coords}>
        {pickedLocation
          ? `Lat: ${pickedLocation.latitude.toFixed(
              6,
            )} | Lon: ${pickedLocation.longitude.toFixed(6)}`
          : 'No location selected'}
      </Text>

      {pickedLocation && (
        <View style={styles.row}>
          <TouchableOpacity style={styles.viewBtn} onPress={handleViewOnMap}>
            <Text style={styles.viewText}>View on Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeleteLocation}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.pickBtn} onPress={openModal}>
        <Text style={styles.pickText}>
          {pickedLocation ? 'Change Location' : 'Pick from Google Maps'}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <LocationPicker
          onLocationSelected={location => {
            setPickedLocation(location);
            closeModal();
          }}
          onCancel={closeModal}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#444',
  },
  addressBox: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  addressInput: {
    flex: 1,
    minHeight: 60,
    textAlignVertical: 'top',
    color: '#333',
  },
  clear: {
    color: '#ff3b30',
    fontSize: 18,
    paddingHorizontal: 8,
  },
  coords: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  viewBtn: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  viewText: { color: '#fff' },
  deleteBtn: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 6,
  },
  deleteText: { color: '#fff' },
  pickBtn: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  pickText: { color: '#fff' },
});
