import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Hederprofile from '../Sparts/opennetwork/Hederprofile';
import Coverimg from '../Sparts/coverimg';
import Profileageandgender from '../Sparts/opennetwork/profileageandgender';
import Basicinfo from '../Sparts/opennetwork/Basicinfo';
import CategoryExperienceInfo from '../Sparts/services/CategoryExperienceInfo';
import ServicesAndPricingInfo from '../Sparts/Professional/ServicesAndPricingInfo';
import SelectedLanguages from '../Sparts/opennetwork/SelectedLanguages';
import AvailabilitySection from '../Sparts/Business/AvailabilitySection';
import Documents from '../Sparts/opennetwork/documents';
import AddressSection from '../Sparts/opennetwork/AddressSection';
import ContactSection from '../Sparts/opennetwork/ContactSection';
import Somesection from '../Sparts/opennetwork/somesection';
import SelectedKeywordsInfo from '../Sparts/Business/SelectedKeywordsInfo';
import CallChatActions from '../Sparts/services/CallChatActions';
import UPIPaymentButton from '../Sparts/opennetwork/UPIPaymentButton';
import GalleryPreview from '../Sparts/Business/GalleryPreview';
import CustomLinks from '../Sparts/opennetwork/CustomLinks';

const Service = ({ isPro }) => {
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
        title="My Service Identity"
        openPress="Eserv"
        isPro={isPro}
        backScreen="Profile"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Coverimg source={profile?.cover_image} />
        <Profileageandgender
          profileSrc={profile?.profile_image}
          gender={profile?.gender}
          birthYear={profile?.birth_year}
        />
        <View style={styles.maincontent}>
          <Basicinfo
            name={profile?.name}
            bio={profile?.bio}
            location={profile?.namelocation}
          />
          <CategoryExperienceInfo
            categories={profile?.selected_skills}
            experience={profile?.year_of_experience}
          />
          <CallChatActions
            phoneNumber={profile?.phone_number}
            onChatPress={() => navigation.navigate('ChatScreen', { userId })}
          />
          <SelectedLanguages languages={profile?.selected_languages} />
          <AvailabilitySection availability={profile?.availability} />

          <GalleryPreview galleryImages={profile?.gallery_images} />
          <Documents documents={profile?.documents} />
          <ServicesAndPricingInfo
            services={profile?.services}
            pricing={profile?.pricing}
          />
          {profile?.upi_id && (
            <UPIPaymentButton
              upiId={profile?.upi_id}
              payeeName={profile?.name || 'User'}
            />
          )}
          <AddressSection
            pickedAddress={profile?.address}
            pickedLocation={pickedlotion}
          />
          <ContactSection
            phoneNumber={profile?.phone_number}
            email={profile?.email}
          />
          <CustomLinks customLinks={profile?.custom_links} />
          <Somesection socialAccounts={profile?.social_accounts} />
          <SelectedKeywordsInfo keywords={profile?.keywords} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Service;

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
