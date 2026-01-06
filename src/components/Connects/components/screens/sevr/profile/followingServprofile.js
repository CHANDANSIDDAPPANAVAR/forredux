import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import useConnectProfileActions from '../../hooks/useConnectProfileActions';
import Coverimg from '../../../../../profile/parts/identity/Sparts/coverimg';
import ProfileIdentityCard from '../../../../../profile/parts/identity/Sparts/Professional/ProfileIdentityCard';
import ProffBio from '../../../../../profile/parts/identity/Sparts/Professional/proffBio';
import ProfessionalInfo from '../../../../../profile/parts/identity/Sparts/Professional/ProfessionalInfo';
import SelectedLanguages from '../../../../../profile/parts/identity/Sparts/opennetwork/SelectedLanguages';
import AvailabilitySection from '../../../../../profile/parts/identity/Sparts/Business/AvailabilitySection';
import Documents from '../../../../../profile/parts/identity/Sparts/opennetwork/documents';
import ServicesAndPricingInfo from '../../../../../profile/parts/identity/Sparts/Professional/ServicesAndPricingInfo';
import GalleryPreview from '../../../../../profile/parts/identity/Sparts/Business/GalleryPreview';
import CustomLinks from '../../../../../profile/parts/identity/Sparts/opennetwork/CustomLinks';
import AddressSection from '../../../../../profile/parts/identity/Sparts/opennetwork/AddressSection';
import ContactSection from '../../../../../profile/parts/identity/Sparts/opennetwork/ContactSection';
import Somesection from '../../../../../profile/parts/identity/Sparts/opennetwork/somesection';
import SelectedKeywordsInfo from '../../../../../profile/parts/identity/Sparts/Business/SelectedKeywordsInfo';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeadreBack from '../../../util/hederback';

const ConnectServiceopen = () => {
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
        <Text>Profile not found or blocked.</Text>
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
        title={'Service Identity'}
        onBlockPress={blockUser}
        onRemoveConnectionPress={removeConnection}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Coverimg source={profile?.cover_image} />
        <ProfileIdentityCard
          profileImage={profile?.profile_image}
          name={profile?.name}
          tagline={profile?.tagline}
          location={profile?.namelocation}
          phoneNumber={profile?.phone_number}
          upiId={profile?.upi_id}
          onChatPress={() =>
            navigation.navigate('Chat', { userId: profile?.user_id })
          }
        />
        <View style={styles.maincontent}>
          <ProffBio bio={profile?.bio} />
          <ProfessionalInfo
            professionalAreas={profile?.selected_skills}
            experience={profile?.year_of_experience}
            certifications={profile?.selected_certifications}
            companyName={profile?.company_name}
          />
          <SelectedLanguages languages={profile?.selected_languages} />
          <AvailabilitySection availability={profile?.availability} />
          <Documents documents={profile?.documents} />
          <ServicesAndPricingInfo services={profile?.services} />

          <GalleryPreview galleryImages={profile?.gallery_images} />
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

export default ConnectServiceopen;
