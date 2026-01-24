import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CreateEventModal from './Eventmaster/parts/CreateEventModal';
import MyEventList from './Eventmaster/parts/MyEventList';
import { useMyEvents } from './Eventmaster/hooks/useMyEvents';
import HeaderProfileSimple from './identity/Eparts/Components/Opennetwork/HeaderProfileSimple';

const Event = () => {
  const { events, loading, error, refresh } = useMyEvents();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderProfileSimple title="Event Master" />
      <View style={styles.bannerWrapper}>
        <Image
          source={require('../../assets/events/eventbanar.jpg')}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        {/* Heading */}
        <Text style={styles.heading}>Manage Your Events</Text>
        <Text style={styles.description}>
          Create, edit and manage all your events in one place.
        </Text>

        {/* Create Event Card */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.createCard}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createTitle}>＋ Create New Event</Text>
          <Text style={styles.createSubtitle}>
            Set up your event and customize it later
          </Text>
        </TouchableOpacity>

        {/* Section */}
        <Text style={styles.subHeading}>Your Events</Text>

        {/* Content */}
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <MyEventList events={events} onRefresh={refresh} />
        )}
      </View>

      <CreateEventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={refresh}
      />
    </SafeAreaView>
  );
};

export default Event;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },

  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  bannerWrapper: {
    paddingHorizontal: 16,
    marginTop: 14,
  },
  banner: {
    width: '100%',
    height: 140,
    borderRadius: 16,
  },

  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    marginBottom: 20,
  },

  createCard: {
    backgroundColor: '#1e90ff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 28,
    elevation: 3,
  },
  createTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  createSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 6,
  },

  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  loader: {
    marginTop: 40,
  },
  errorText: {
    marginTop: 20,
    color: '#ff4d4f',
    fontSize: 14,
    textAlign: 'center',
  },
});
