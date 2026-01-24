import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  Image,
} from 'react-native';

// Replace with your actual icons
const locationIcon = require('../../../../../assets/events/direction.png'); // pin/map icon
const directionsIcon = require('../../../../../assets/events/traffic-sign.png'); // arrow or car icon

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────
const openDirections = async (lat, lng, label = 'Destination') => {
  if (!lat || !lng) {
    Alert.alert('Error', 'Location coordinates are missing.');
    return;
  }

  const latLng = `${lat},${lng}`;
  const encodedLabel = encodeURIComponent(label);

  // Preferred order: Google Maps → Apple Maps → Web fallback

  const googleMapsUrl = `comgooglemaps://?daddr=${latLng}&q=${encodedLabel}`;
  const appleMapsUrl = `maps://?q=${encodedLabel}&ll=${latLng}`;
  const webGoogleUrl = `https://www.google.com/maps/dir/?api=1&destination=${latLng}&destination_place_id=${encodedLabel}`;

  try {
    // 1. Try Google Maps app
    const canOpenGoogle = await Linking.canOpenURL(googleMapsUrl);
    if (canOpenGoogle) {
      await Linking.openURL(googleMapsUrl);
      return;
    }

    // 2. Try Apple Maps (iOS only)
    if (Platform.OS === 'ios') {
      const canOpenApple = await Linking.canOpenURL(appleMapsUrl);
      if (canOpenApple) {
        await Linking.openURL(appleMapsUrl);
        return;
      }
    }

    // 3. Fallback to web Google Maps (opens in browser or installed app)
    await Linking.openURL(webGoogleUrl);
  } catch (error) {
    Alert.alert('Error', "Couldn't open maps. Please try manually.");
    console.warn('Map open error:', error);
  }
};

// ────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────
const VenueCard = ({
  address = '',
  venueName = '',
  latitude,
  longitude,
  style,
}) => {
  const hasCoords = latitude && longitude;

  const handleDirections = () => {
    openDirections(latitude, longitude, venueName || address || 'Venue');
  };

  return (
    <View style={[styles.card, style]}>
      {/* Venue / Address Section */}
      <View style={styles.headerRow}>
        <Image source={locationIcon} style={styles.icon} />
        <View style={styles.textContainer}>
          {venueName ? (
            <>
              <Text style={styles.venueName}>{venueName}</Text>
              <Text style={styles.address}>{address}</Text>
            </>
          ) : (
            <Text style={styles.addressFull}>
              {address || 'No address provided'}
            </Text>
          )}
        </View>
      </View>

      {/* Directions Button – only show if we have coordinates */}
      {hasCoords && (
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleDirections}
          activeOpacity={0.8}
        >
          <Image source={directionsIcon} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      )}

      {/* Optional: small note if no coords */}
      {!hasCoords && address && (
        <Text style={styles.note}>No map coordinates available</Text>
      )}
    </View>
  );
};

export default memo(VenueCard);

// ────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    marginVertical: 12,

    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  icon: {
    width: 34,
    height: 34,
    marginRight: 14,
    tintColor: '#000000ff', // red pin color – or your brand
  },

  textContainer: {
    flex: 1,
  },

  venueName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },

  address: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },

  addressFull: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },

  directionsButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 12,
  },

  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: '#ffffff',
  },

  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },

  note: {
    marginTop: 8,
    fontSize: 13,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
