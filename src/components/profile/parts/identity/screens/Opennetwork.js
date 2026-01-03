import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import CoverImage from '../Sparts/coverimg';
import Profileageandgender from '../Sparts/opennetwork/profileageandgender';
import Basicinfo from '../Sparts/opennetwork/Basicinfo';
import StatusSection from '../Sparts/opennetwork/StatusSection';
import SelectedLanguages from '../Sparts/opennetwork/SelectedLanguages';
import Documents from '../Sparts/opennetwork/documents';

import ContactSection from '../Sparts/opennetwork/ContactSection';
import UPIPaymentButton from '../Sparts/opennetwork/UPIPaymentButton';
import AddressSection from '../Sparts/opennetwork/AddressSection';
import CustomLinks from '../Sparts/opennetwork/CustomLinks';
import Somesection from '../Sparts/opennetwork/somesection';
import Hederprofile from '../Sparts/opennetwork/Hederprofile';

const Opennetwork = ({ isPro }) => {
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
        title="My Identity"
        openPress="Fopen"
        isPro={isPro}
        backScreen="Profile"
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CoverImage source={profile?.cover_image} />
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
          <StatusSection
            status={profile?.status_type}
            fillone={profile?.fillone}
            filltwo={profile?.filltwo}
          />
          <SelectedLanguages languages={profile?.selected_languages} />
          <Documents documents={profile?.documents} />

          <CustomLinks customLinks={profile?.custom_links} />
          <ContactSection
            phoneNumber={profile?.phone_number}
            email={profile?.email}
            emergencyNumber={profile?.emergency_number}
          />
          {profile?.upi_id && (
            <UPIPaymentButton
              upiId={profile?.upi_id}
              payeeName={profile?.name || 'User'}
            />
          )}
          <AddressSection
            pickedAddress={profile?.address}
            pickedLocation={
              profile?.lat && profile?.lng
                ? {
                    latitude: profile?.lat,
                    longitude: profile?.lng,
                  }
                : null
            }
          />
          <Somesection socialAccounts={profile?.social_accounts} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Opennetwork;
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
