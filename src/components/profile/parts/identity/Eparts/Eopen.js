import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import CoverImagePicker from './Components/Opennetwork/Coverimageuplod';
import HeaderProfileSimple from './Components/Opennetwork/HeaderProfileSimple';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import ProfileImagePicker from './Components/Opennetwork/ProfileImagePicker';
import NameInput from './Components/Opennetwork/NameInput';

const Eopen = () => {
  const navigation = useNavigation();
  const { accessToken } = useSelector(state => state.auth);

  const [profile, setProfile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  /* -----------------------------
     Load profile
  ------------------------------ */
  useEffect(() => {
    if (!accessToken) return;

    let active = true;

    const loadProfile = async () => {
      try {
        const data = await fetchAndCacheProfile(accessToken);
        if (!active) return;

        setProfile(data);

        setCoverImage(prev =>
          prev !== null ? prev : data?.cover_image || null,
        );
        setProfileImage(prev =>
          prev !== null ? prev : data?.profile_image || null,
        );
        setName(prev => (prev !== null ? prev : data?.name || ''));
      } catch {}
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, [accessToken]);

  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView
        style={styles.maincontkey}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <HeaderProfileSimple title="My Identity" />
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <CoverImagePicker
            coverImage={coverImage}
            setCoverImage={setCoverImage}
            navigation={navigation}
          />
          <ProfileImagePicker
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <View style={styles.profileinputsection}>
            <NameInput name={name} setName={setName} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Eopen;

const styles = StyleSheet.create({
  main: { flex: 1 },
  maincontkey: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fafafa' },
  profileinputsection: { paddingHorizontal: 20, marginBottom: 80 },
});
