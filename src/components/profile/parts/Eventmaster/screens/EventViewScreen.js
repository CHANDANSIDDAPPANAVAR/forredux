import React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import { useEventView } from '../hooks/useEventView';
import HeaderProfileSimple from '../../identity/Eparts/Components/Opennetwork/HeaderProfileSimple';
import Coverimg from '../../identity/Sparts/coverimg';
import EventImage from '../parts/privew/EventImage';
import EventTitleBlock from '../parts/privew/EventTitleBlock';
import EventCategoryTypeMeta from '../parts/privew/EventCategoryTypeMeta';
import EventDateTimeCard from '../parts/privew/EventDateTimeCard';
import OpenDirections from '../parts/privew/openDirections';
import Documents from '../../identity/Sparts/opennetwork/documents';
import GalleryPreview from '../../identity/Sparts/Business/GalleryPreview';

import Tickettype from '../parts/privew/tickettype';
import ContactEvent from '../parts/privew/ContactEvent';
import CustomLinks from '../../identity/Sparts/opennetwork/CustomLinks';
import Somesection from '../../identity/Sparts/opennetwork/somesection';
import SelectedKeywordsInfo from '../../identity/Sparts/Business/SelectedKeywordsInfo';
import ProffBio from '../../identity/Sparts/Professional/proffBio';

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
        <View style={styles.maincontent}>
          <EventTitleBlock title={event.name} tagline={event.tagline} />
          <EventCategoryTypeMeta
            category={event.category}
            types={event.type}
            mode={event.mode}
          />
          <Tickettype ticketType={event.ticket_type} />
          <ProffBio bio={event.description} />
          <EventDateTimeCard
            startDate={event.start_datetime}
            endDate={event.end_datetime}
          />

          <OpenDirections
            venueName={event.venue_name}
            address={event.address}
            latitude={event.latitude}
            longitude={event.longitude}
          />

          <GalleryPreview galleryImages={event.gallery_images} />
          <Documents documents={event.documents} />

          <ContactEvent
            phoneNumber={event.phone_number}
            email={event.email}
            alternateNumber={event.alt_phone_number}
            contactPerson={event.organizer_name}
          />
          <CustomLinks customLinks={event.custom_links} />

          <Somesection socialAccounts={event.social_links} />
          <SelectedKeywordsInfo keywords={event.keywords} />
        </View>
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
  maincontent: { paddingHorizontal: 20, paddingBottom: 50 },
});
