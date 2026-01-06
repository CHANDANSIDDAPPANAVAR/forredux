import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';

import Coverimg from '../../../../../profile/parts/identity/Sparts/coverimg';
import Profileageandgender from '../../../../../profile/parts/identity/Sparts/opennetwork/profileageandgender';
import Basicinfo from '../../../../../profile/parts/identity/Sparts/opennetwork/Basicinfo';
import StatusSection from '../../../../../profile/parts/identity/Sparts/opennetwork/StatusSection';
import SelectedLanguages from '../../../../../profile/parts/identity/Sparts/opennetwork/SelectedLanguages';
import Documents from '../../../../../profile/parts/identity/Sparts/opennetwork/documents';
import ContactSection from '../../../../../profile/parts/identity/Sparts/opennetwork/ContactSection';
import UPIPaymentButton from '../../../../../profile/parts/identity/Sparts/opennetwork/UPIPaymentButton';
import AddressSection from '../../../../../profile/parts/identity/Sparts/opennetwork/AddressSection';
import CustomLinks from '../../../../../profile/parts/identity/Sparts/opennetwork/CustomLinks';
import Somesection from '../../../../../profile/parts/identity/Sparts/opennetwork/somesection';
import HeadreBack from '../../../util/hederback';

import useConnectProfileActions from '../../hooks/useConnectProfileActions';

const Followingopen = () => {
  const route = useRoute();
  const { userId } = route.params;

  const { profile, loading, blockUser, removeConnection } =
    useConnectProfileActions({ userId });

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  /* ---------------- EMPTY / BLOCKED ---------------- */
  if (!profile) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Profile not found or blocked.</Text>
      </View>
    );
  }

  /* ---------------- RENDER ---------------- */
  return (
    <SafeAreaView style={styles.container}>
      <HeadreBack
        title="Identity"
        onBlockPress={blockUser}
        onRemoveConnectionPress={removeConnection}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Coverimg source={profile.cover_image} />

        <Profileageandgender
          profileSrc={profile.profile_image}
          gender={profile.gender}
          birthYear={profile.birth_year}
        />

        <View style={styles.detailsContainer}>
          <Basicinfo
            name={profile.name}
            bio={profile.bio}
            location={profile.namelocation}
          />

          <StatusSection
            status={profile.status_type}
            fillone={profile.fillone}
            filltwo={profile.filltwo}
          />

          <SelectedLanguages languages={profile.selected_languages} />
          <Documents documents={profile.documents} />

          <ContactSection
            phoneNumber={profile.phone_number}
            email={profile.email}
            emergencyNumber={profile.emergency_number}
          />

          {profile.upi_id && (
            <UPIPaymentButton
              upiId={profile.upi_id}
              payeeName={profile.name || 'User'}
            />
          )}

          <AddressSection
            pickedAddress={profile.address}
            pickedLocation={
              profile.lat && profile.lng
                ? { latitude: profile.lat, longitude: profile.lng }
                : null
            }
          />

          <CustomLinks customLinks={profile.custom_links} />
          <Somesection socialAccounts={profile.social_accounts} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Followingopen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
