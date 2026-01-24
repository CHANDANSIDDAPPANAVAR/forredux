import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import HeaderProfileSimple from '../../identity/Eparts/Components/Opennetwork/HeaderProfileSimple';
import CoverImagePicker from '../../identity/Eparts/Components/Opennetwork/Coverimageuplod';
import EventImagePicker from '../parts/inputparts/EventImagePicker';
import NameInput from '../../identity/Eparts/Components/Opennetwork/NameInput';
import Tagline from '../../identity/Eparts/Components/proff/tagline';
import Bioinput from '../../identity/Eparts/Components/Opennetwork/Bioinput';
import EventCategorySelector from '../parts/inputparts/EventCategorySelector';
import EventTypeSelector from '../parts/inputparts/EventTypeSelector';
import ModeSelector from '../parts/inputparts/ModeSelector';
import VenueInput from '../parts/inputparts/VenueInput';
import LocationSection from '../../identity/Eparts/Components/Opennetwork/LocationSection';
import DateTimeSection from '../parts/inputparts/DateTimeSection';
import TicketOptions from '../parts/inputparts/TicketOptions';
import OrganizerInput from '../parts/inputparts/OrganizerInput';
import OrgContactInfo from '../parts/inputparts/OrgContactInfo';
import VisibilitySelector from '../parts/inputparts/VisibilitySelector';
import VisibilitySection from '../parts/inputparts/VisibilitySection';
import KeywordInput from '../../identity/Eparts/Components/proff/keywords';
import GalleryInput from '../../identity/Eparts/Components/proff/galaryinput';
import ProfileFileScreen from '../../identity/Eparts/Components/Opennetwork/documentsuplod';
import SocialMediaInputs from '../../identity/Eparts/Components/Opennetwork/someinput';
import CustomLinksInput from '../../identity/Eparts/Components/Opennetwork/costoumlink';

import { useEventForm } from '../hooks/useEventForm';
import { useEventSave } from '../hooks/useEventSave';
import { useEventValidation } from '../hooks/useEventValidation';
import { useEventFetch } from '../hooks/useEventFetch';
const CreateEventScreen = () => {
  const route = useRoute();
  const { event_id } = route.params || {};

  const navigation = useNavigation();

  // ✅ 1. INIT FORM FIRST
  const form = useEventForm();

  // ✅ 2. THEN FETCH & FILL FORM
  const { loading, originalEvent } = useEventFetch(event_id, form);

  // ✅ 3. SAVE USES ORIGINAL EVENT
  const { save } = useEventSave({
    form,
    navigation,
    event_id,
    originalEvent,
  });

  const validation = useEventValidation(form);

  const [eventLocationModal, setEventLocationModal] = useState(false);
  const [publicLocationModal, setPublicLocationModal] = useState(false);
  const handleEventLocationSelected = (location, address) => {
    form.setPickedLocation(location);
    form.setPickedAddress(address);
    setTimeout(() => setEventLocationModal(false), 50);
  };

  const handlePublicLocation = location => {
    form.setPickedPublicLocation(location);
    setPublicLocationModal(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center' }}>Loading event...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.main}>
      <HeaderProfileSimple title="Event Master" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Cover Image */}
          <CoverImagePicker
            coverImage={form.coverImage}
            setCoverImage={form.setCoverImage}
          />

          {/* Event Image */}
          <EventImagePicker
            eventImage={form.eventImage}
            setEventImage={form.setEventImage}
          />

          <View style={styles.profileInputSection}>
            <NameInput
              label="Event Title"
              placeholder="e.g. Rohit & Anjali Wedding"
              name={form.eventTitle}
              setName={form.setEventTitle}
            />

            <Tagline
              type="event"
              tagline={form.tagline}
              setTagline={form.setTagline}
            />
            <Bioinput
              type="event"
              bio={form.eventDescription}
              setBio={form.setEventDescription}
            />

            <EventCategorySelector
              category={form.category}
              setCategory={form.setCategory}
            />

            {form.category && (
              <EventTypeSelector
                selectedTypes={form.eventTypes}
                setSelectedTypes={form.setEventTypes}
              />
            )}

            <ModeSelector
              selectedMode={form.mode}
              setSelectedMode={form.setMode}
            />

            {form.mode === 'Offline' && (
              <>
                <VenueInput
                  venueName={form.venueName}
                  setVenueName={form.setVenueName}
                />
                <LocationSection
                  pickedLocation={form.pickedLocation}
                  pickedAddress={form.pickedAddress}
                  modalVisible={eventLocationModal}
                  openModal={() => setEventLocationModal(true)}
                  closeModal={() => setEventLocationModal(false)}
                  handleLocationSelected={handleEventLocationSelected}
                  setPickedLocation={form.setPickedLocation}
                  setPickedAddress={form.setPickedAddress}
                />
              </>
            )}

            <DateTimeSection
              startDateTime={form.startDateTime}
              endDateTime={form.endDateTime}
              setStartDateTime={form.setStartDateTime}
              setEndDateTime={form.setEndDateTime}
            />

            <TicketOptions
              ticketType={form.ticketType}
              setTicketType={form.setTicketType}
            />

            <OrganizerInput
              organizerName={form.organizerName}
              setOrganizerName={form.setOrganizerName}
            />

            <OrgContactInfo
              phoneNumber={form.phoneNumber}
              setPhoneNumber={form.setPhoneNumber}
              altPhoneNumber={form.altPhoneNumber}
              setAltPhoneNumber={form.setAltPhoneNumber}
              email={form.email}
              setEmail={form.setEmail}
            />

            <VisibilitySelector
              visibility={form.visibility}
              setVisibility={form.setVisibility}
            />

            {form.visibility === 'public' && (
              <>
                <VisibilitySection
                  pickedLocation={form.pickedPublicLocation}
                  setPickedLocation={form.setPickedPublicLocation}
                  modalVisible={publicLocationModal}
                  openModal={() => setPublicLocationModal(true)}
                  closeModal={() => setPublicLocationModal(false)}
                  handleLocation={handlePublicLocation}
                />
                <KeywordInput
                  keywords={form.keywords}
                  setKeywords={form.setKeywords}
                />
              </>
            )}

            <GalleryInput
              galleryImages={form.galleryImages}
              setGalleryImages={form.setGalleryImages}
            />

            <ProfileFileScreen
              onFilesPicked={form.setDocuments}
              initialFile={form.documents}
              augtitle="Upload Event Documents (Invitation, Brochure, PDF)"
            />

            <SocialMediaInputs
              socialAccounts={form.socialAccounts}
              setSocialAccounts={form.setSocialAccounts}
              selectedPlatforms={form.selectedPlatforms}
              setSelectedPlatforms={form.setSelectedPlatforms}
            />

            <CustomLinksInput
              customLinks={form.customLinks}
              setCustomLinks={form.setCustomLinks}
            />
          </View>
        </ScrollView>

        {!validation.valid && validation.message && (
          <Text style={{ color: '#d32f2f', marginBottom: 8 }}>
            {validation.message}
          </Text>
        )}

        <View style={styles.saveWrapper}>
          <TouchableOpacity
            style={[styles.saveBtn, !validation.valid && { opacity: 0.6 }]}
            disabled={!validation.valid}
            onPress={save}
          >
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fafafa' },
  profileInputSection: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  saveWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
