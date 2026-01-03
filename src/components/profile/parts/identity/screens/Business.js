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
import ProffBio from '../Sparts/Professional/proffBio';
import BusinessIdentityCard from '../Sparts/Business/BusinessIdentityCard';
import CallChatActions from '../Sparts/services/CallChatActions';

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

  const pickedlotion = {
    latitude: profile?.latitude,
    longitude: profile?.longitude,
  };
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
