import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { useEventView } from '../hooks/useEventView';
import HeaderProfileSimple from '../../identity/Eparts/Components/Opennetwork/HeaderProfileSimple';
import Coverimg from '../../identity/Sparts/coverimg';
import EventImage from '../parts/privew/EventImage';

const EventViewScreen = () => {
  const { params } = useRoute();
  const { event_id } = params || {};

  const { loading, event, error } = useEventView(event_id);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading event...</Text>
      </SafeAreaView>
    );
  }

  if (!event || error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Event not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.main}>
      <HeaderProfileSimple title="Event" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Coverimg source={event?.cover_image} />
        <EventImage source={event.profile_image} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventViewScreen;
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cover: {
    width: '100%',
    height: 200,
  },
  profile: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginTop: -45,
    marginLeft: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  meta: {
    fontSize: 13,
    color: '#444',
    marginBottom: 6,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
  },
  gallery: {
    width: 160,
    height: 120,
    borderRadius: 10,
    marginLeft: 12,
    marginBottom: 20,
  },
});
