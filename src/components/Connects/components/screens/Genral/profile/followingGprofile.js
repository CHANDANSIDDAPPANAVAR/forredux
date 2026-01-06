import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import api from '../../../../../../services/api';

import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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
const Followingopen = ({ route }) => {
  const { accessToken } = useSelector(state => state.auth);
  const { userId } = route.params;
  const { tokens } = accessToken;
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get(`/api/connectprofile/${userId}`, {
          headers: { Authorization: `Bearer ${tokens}` },
        });
        setOriginalProfile(res.data);
      } catch (e) {
        console.error('Error fetching profile:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId, tokens]);

  const handleBlock = async () => {
    try {
      await api.post(
        `/api/connect/block/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${tokens}` },
        },
      );
      navigation.navigate('Appin', {
        screen: 'Connects',
        params: { screen: 'Genral' },
      });
    } catch (e) {
      console.error('Error blocking:', e);
    } finally {
    }
  };

  const handleRemoveConnection = async () => {
    try {
      await api.delete(`/api/connect/unfollow/${userId}`, {
        headers: { Authorization: `Bearer ${tokens}` },
      });
      navigation.navigate('Appin', {
        screen: 'Connects',
        params: { screen: 'Genral' },
      });
    } catch (e) {
      console.error('Error removing connection:', e);
    } finally {
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#5271ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!originalProfile) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Profile not found or blocked.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeadreBack
        title={'Identity'}
        onBlockPress={handleBlock}
        onRemoveConnectionPress={handleRemoveConnection}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Coverimg source={originalProfile.cover_image} />
        <Profileageandgender
          profileSrc={originalProfile.profile_image}
          gender={originalProfile.gender}
          birthYear={originalProfile.birth_year}
        />
        <View style={styles.detailsContainer}>
          <Basicinfo
            name={originalProfile.name}
            bio={originalProfile.bio}
            location={originalProfile.namelocation}
          />
          <StatusSection
            status={originalProfile.status_type}
            fillone={originalProfile.fillone}
            filltwo={originalProfile.filltwo}
          />
          <SelectedLanguages languages={originalProfile.selected_languages} />
          <Documents documents={originalProfile.documents} />
          <ContactSection
            phoneNumber={originalProfile.phone_number}
            email={originalProfile.email}
            emergencyNumber={originalProfile.emergency_number}
          />
          {originalProfile.upi_id && (
            <UPIPaymentButton
              upiId={originalProfile.upi_id}
              payeeName={originalProfile.name || 'User'}
            />
          )}
          <AddressSection
            pickedAddress={originalProfile.address}
            pickedLocation={
              originalProfile.lat && originalProfile.lng
                ? {
                    latitude: originalProfile.lat,
                    longitude: originalProfile.lng,
                  }
                : null
            }
          />
          <CustomLinks customLinks={originalProfile.custom_links} />
          <Somesection socialAccounts={originalProfile.social_accounts} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.94)' },
  scrollContainer: { paddingBottom: 80 },
  detailsContainer: { paddingHorizontal: 20, paddingVertical: 10 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  blockedContainer: {
    flex: 1,
  },
  blockedText: { color: '#999', fontSize: 18, textAlign: 'center' },
  connectButton: {
    backgroundColor: '#5271ff',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  dualButtonWrapper: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
  },

  previewWrapper: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  connectedButton: { backgroundColor: '#4caf50' },
  pendingButton: { backgroundColor: '#ff9800' },
  connectBackButton: { backgroundColor: '#086c9aff' },
  connectButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Followingopen;
