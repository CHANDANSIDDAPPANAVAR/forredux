import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import { SafeAreaView } from 'react-native-safe-area-context';
import Hederprofile from '../Sparts/opennetwork/Hederprofile';
import Coverimg from '../Sparts/coverimg';
import Profesprofile from '../Sparts/Professional/profesprofile';

import ProfessionalInfo from '../Sparts/Professional/ProfessionalInfo';
import ServicesAndPricingInfo from '../Sparts/Professional/ServicesAndPricingInfo';
import SelectedLanguages from '../Sparts/opennetwork/SelectedLanguages';
import AvailabilitySection from '../Sparts/Business/AvailabilitySection';
import GalleryPreview from '../Sparts/Business/GalleryPreview';
import AddressSection from '../Sparts/opennetwork/AddressSection';
import CustomLinks from '../Sparts/opennetwork/CustomLinks';
import Somesection from '../Sparts/opennetwork/somesection';
import SelectedKeywordsInfo from '../Sparts/Business/SelectedKeywordsInfo';
import Documents from '../Sparts/opennetwork/documents';
import UPIPaymentButton from '../Sparts/opennetwork/UPIPaymentButton';
import ContactSection from '../Sparts/opennetwork/ContactSection';
import ProfileIdentityCard from '../Sparts/Professional/ProfileIdentityCard';
import ProffBio from '../Sparts/Professional/proffBio';
const Professionals = ({ isPro }) => {
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
    <SafeAreaView>
      <Hederprofile
        title="My Professional Identity"
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
export default Professionals;
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
