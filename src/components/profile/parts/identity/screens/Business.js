import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import { useSelector } from 'react-redux';
import Hederprofile from '../Sparts/opennetwork/Hederprofile';
import Coverimg from '../Sparts/coverimg';
import BussLogoPreview from '../Sparts/Business/BussLogoPreview';
import BusinessBasicInfo from '../Sparts/Business/BusinessBasicInfo';
import ContactSection from '../Sparts/opennetwork/ContactSection';
import SelectedLanguages from '../Sparts/opennetwork/SelectedLanguages';
import AvailabilitySection from '../Sparts/Business/AvailabilitySection';
import GalleryPreview from '../Sparts/Business/GalleryPreview';
import Documents from '../Sparts/opennetwork/documents';
import UPIPaymentButton from '../Sparts/opennetwork/UPIPaymentButton';
import AddressSection from '../Sparts/opennetwork/AddressSection';
import Somesection from '../Sparts/opennetwork/somesection';
import CustomLinks from '../Sparts/opennetwork/CustomLinks';
import SelectedKeywordsInfo from '../Sparts/Business/SelectedKeywordsInfo';

const Business = ({ isPro }) => {
  const { accessToken } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const loadProfile = async () => {
      try {
        const data = await fetchAndCacheProfile(accessToken);
        setProfile(data);
        console.log(data);
      } catch (err) {
        console.error('❌ Failed to load profile:', err);
      }
    };

    loadProfile();
  }, [accessToken]);

  return (
    <SafeAreaView style={styles.container}>
      <Hederprofile
        title="My Bussiness Identity"
        openPress="Ebuss"
        isPro={isPro}
        backScreen="Profile"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Coverimg source={profile?.cover_image} />
        <BussLogoPreview
          logoSrc={profile?.profile_image}
          birthYear={profile?.birth_year}
        />
        <View style={styles.maincontent}>
          <BusinessBasicInfo
            businessName={profile?.name}
            tagline={profile?.tagline}
            city={profile?.namelocation}
            bio={profile?.bio}
            category={profile?.selected_skills}
          />
          <ContactSection
            phoneNumber={profile?.phone_number}
            email={profile?.email}
            emergencyNumber={profile?.emergency_number}
          />
          <SelectedLanguages languages={profile?.selected_languages} />
          <AvailabilitySection availability={profile?.availability} />
          <GalleryPreview galleryImages={profile?.gallery_images} />
          <Documents documents={profile?.documents} />
          {profile?.upi_id && <UPIPaymentButton upiId={profile?.upi_id} />}

          <AddressSection
            pickedAddress={profile?.address}
            pickedLocation={profile?.pickedLocation}
          />

          <CustomLinks customLinks={profile?.custom_links} />
          <Somesection socialAccounts={profile?.social_accounts} />
          <SelectedKeywordsInfo keywords={profile?.keywords} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Business;

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
