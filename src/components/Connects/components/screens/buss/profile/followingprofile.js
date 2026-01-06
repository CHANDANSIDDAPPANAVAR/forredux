import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  BackHandler,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import useConnectProfileActions from '../../hooks/useConnectProfileActions';
import HeadreBack from '../../../util/hederback';
import Coverimg from '../../../../../profile/parts/identity/Sparts/coverimg';
import BusinessIdentityCard from '../../../../../profile/parts/identity/Sparts/Business/BusinessIdentityCard';
import CallChatActions from '../../../../../profile/parts/identity/Sparts/services/CallChatActions';
import ProffBio from '../../../../../profile/parts/identity/Sparts/Professional/proffBio';
import Documents from '../../../../../profile/parts/identity/Sparts/opennetwork/documents';
import AvailabilitySection from '../../../../../profile/parts/identity/Sparts/Business/AvailabilitySection';
import SelectedLanguages from '../../../../../profile/parts/identity/Sparts/opennetwork/SelectedLanguages';
import GalleryPreview from '../../../../../profile/parts/identity/Sparts/Business/GalleryPreview';
import UPIPaymentButton from '../../../../../profile/parts/identity/Sparts/opennetwork/UPIPaymentButton';
import CustomLinks from '../../../../../profile/parts/identity/Sparts/opennetwork/CustomLinks';
import AddressSection from '../../../../../profile/parts/identity/Sparts/opennetwork/AddressSection';
import ContactSection from '../../../../../profile/parts/identity/Sparts/opennetwork/ContactSection';
import Somesection from '../../../../../profile/parts/identity/Sparts/opennetwork/somesection';
import SelectedKeywordsInfo from '../../../../../profile/parts/identity/Sparts/Business/SelectedKeywordsInfo';

const Bussconneted = () => {
  const route = useRoute();
  const { userId } = route.params;

  const { profile, loading, blockUser, removeConnection } =
    useConnectProfileActions({ userId });
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Profile not found or inaccessible.</Text>
      </View>
    );
  }
  const pickedlotion = {
    latitude: profile?.latitude,
    longitude: profile?.longitude,
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeadreBack
        title="Bussiness Identity"
        onBlockPress={blockUser}
        onRemoveConnectionPress={removeConnection}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Coverimg source={profile?.cover_image} />

        <View style={styles.maincontent}>
          <BusinessIdentityCard
            logo={profile?.profile_image} // or business_logo
            businessName={profile?.name}
            tagline={profile?.tagline}
            category={profile?.selected_skills} // e.g. "IT Consultant"
            city={profile?.namelocation} // e.g. "Tumkuru"
            startYear={profile?.birth_year}
          />
          <CallChatActions
            phoneNumber={profile?.phone_number}
            onChatPress={() => navigation.navigate('ChatScreen', { userId })}
          />
          <ProffBio bio={profile?.bio} />

          <Documents documents={profile?.documents} />
          <AvailabilitySection availability={profile?.availability} />
          <SelectedLanguages languages={profile?.selected_languages} />

          <GalleryPreview galleryImages={profile?.gallery_images} />
          {profile?.upi_id && <UPIPaymentButton upiId={profile?.upi_id} />}

          <CustomLinks customLinks={profile?.custom_links} />
          <AddressSection
            pickedAddress={profile?.address}
            pickedLocation={pickedlotion}
          />
          <ContactSection
            phoneNumber={profile?.phone_number}
            email={profile?.email}
          />
          <Somesection socialAccounts={profile?.social_accounts} />
          <SelectedKeywordsInfo keywords={profile?.keywords} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  maincontent: { paddingHorizontal: 20, paddingBottom: 50 },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    color: '#667085',
    marginTop: 4,
  },
});

export default Bussconneted;
