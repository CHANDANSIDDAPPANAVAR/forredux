import React, { useEffect, useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import HeaderProfileSimple from './Components/Opennetwork/HeaderProfileSimple';
import CoverImagePicker from './Components/Opennetwork/Coverimageuplod';
import ProfileImagePicker from './Components/Opennetwork/ProfileImagePicker';
import NameInput from './Components/Opennetwork/NameInput';
import GenderDobInput from './Components/Opennetwork/dobgender';
import JobStudyCont from './Components/Opennetwork/jobstudy';
import BioInput from './Components/Opennetwork/Bioinput';
import LanguagesSpokenSelector from './Components/Opennetwork/langauges';
import BasicContactInfo from './Components/Opennetwork/contactinfo';
import ProfileDocumentUpload from './Components/Opennetwork/documentsuplod';

import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import SocialMediaInputs from './Components/Opennetwork/someinput';

import CustomLinksInput from './Components/Opennetwork/costoumlink';
import LocationSection from './Components/Opennetwork/LocationSection';
import UpiInput from './Components/Opennetwork/UpiInput';
import LocationInput from './Components/Opennetwork/LocationInput';

const Eopen = () => {
  const navigation = useNavigation();
  const { accessToken } = useSelector(state => state.auth);

  const [hydrated, setHydrated] = useState(false);

  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [namelocation, setNameLocation] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState('');
  const [fillOne, setFillOne] = useState('');
  const [fillTwo, setFillTwo] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [document, setDocument] = useState(null);
  const [socialAccounts, setSocialAccounts] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [socialHydrated, setSocialHydrated] = useState(false);
  const [customLinks, setCustomLinks] = useState([]);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [pickedAddress, setPickedAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [upiId, setUpiId] = useState('');
  const handleLocationSelected = useCallback(location => {
    setPickedLocation(location);

    setModalVisible(false);
  }, []);

  /* -----------------------------
     Load profile once (SAFE)
  ------------------------------ */
  useEffect(() => {
    if (!accessToken || hydrated) return;

    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await fetchAndCacheProfile(accessToken);
        if (!mounted || !data) return;
        console.log(data.social_accounts);
        console.log(data);
        setCoverImage(prev => prev ?? data.cover_image ?? null);
        setProfileImage(prev => prev ?? data.profile_image ?? null);
        setName(prev => (prev !== '' ? prev : data.name ?? ''));
        setNameLocation(prev => (prev !== '' ? prev : data.namelocation ?? ''));
        setGender(prev => (prev !== '' ? prev : data.gender ?? ''));
        setBirthYear(prev =>
          prev !== '' ? prev : String(data.birth_year ?? ''),
        );
        setBio(prev => (prev !== '' ? prev : data.bio ?? ''));
        setStatus(prev => (prev !== '' ? prev : data.status_type ?? ''));
        setFillOne(prev => (prev !== '' ? prev : data.fillone ?? ''));
        setFillTwo(prev => (prev !== '' ? prev : data.filltwo ?? ''));
        setSelectedLanguages(prev =>
          prev.length > 0
            ? prev
            : Array.isArray(data.selected_languages)
            ? data.selected_languages
            : [],
        );

        setPhoneNumber(prev => (prev !== '' ? prev : data.phone_number ?? ''));
        setEmail(prev => (prev !== '' ? prev : data.email ?? ''));
        setEmergencyNumber(prev =>
          prev !== '' ? prev : data.emergency_number ?? '',
        );
        setDocument(
          Array.isArray(data.documents) && data.documents.length > 0
            ? data.documents[0]
            : null,
        );
        // Social accounts (SAFE hydrate once)
        if (!socialHydrated && data.social_accounts) {
          const cleanedSocials = Object.fromEntries(
            Object.entries(data.social_accounts).filter(
              ([_, v]) => typeof v === 'string' && v.trim() !== '',
            ),
          );

          setSocialAccounts(cleanedSocials);
          setSelectedPlatforms(Object.keys(cleanedSocials));
          setSocialHydrated(true);
        }
        setCustomLinks(prev =>
          Array.isArray(prev) && prev.length > 0
            ? prev
            : Array.isArray(data.custom_links)
            ? data.custom_links
            : [],
        );

        setPickedLocation(prev => {
          if (prev) return prev;

          if (typeof data.lat === 'number' && typeof data.lng === 'number') {
            return {
              latitude: data.lat,
              longitude: data.lng,
            };
          }

          return null;
        });

        setPickedAddress(prev => {
          if (prev !== '') return prev;
          return data.address ?? '';
        });
        setUpiId(prev => (prev !== '' ? prev : data.upi_id ?? ''));
        setHydrated(true);
      } catch {}
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [accessToken, hydrated]);

  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <HeaderProfileSimple title="My Identity" />

        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
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

          <View style={styles.profileInputSection}>
            <NameInput name={name} setName={setName} />
            <GenderDobInput
              gender={gender}
              setGender={setGender}
              birthYear={birthYear}
              setBirthYear={setBirthYear}
            />
            <LocationInput
              Namelocation={namelocation}
              setNameLocation={setNameLocation}
            />

            <BioInput bio={bio} setBio={setBio} />

            <JobStudyCont
              status={status}
              fillOne={fillOne}
              fillTwo={fillTwo}
              setStatus={setStatus}
              setFillOne={setFillOne}
              setFillTwo={setFillTwo}
            />

            <LanguagesSpokenSelector
              selectedLanguages={selectedLanguages}
              setSelectedLanguages={setSelectedLanguages}
            />
            <BasicContactInfo
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              email={email}
              setEmail={setEmail}
              emergencyNumber={emergencyNumber}
              setEmergencyNumber={setEmergencyNumber}
            />
            <ProfileDocumentUpload
              onFilesPicked={setDocument}
              initialFile={document}
              augtitle="Upload Resume / Certificate"
            />

            <LocationSection
              pickedLocation={pickedLocation}
              pickedAddress={pickedAddress}
              setPickedLocation={setPickedLocation}
              setPickedAddress={setPickedAddress}
              modalVisible={modalVisible}
              openModal={() => setModalVisible(true)}
              closeModal={() => setModalVisible(false)}
              handleLocationSelected={handleLocationSelected}
            />

            <UpiInput upiId={upiId} setUpiId={setUpiId} />
            <SocialMediaInputs
              socialAccounts={socialAccounts}
              setSocialAccounts={setSocialAccounts}
              selectedPlatforms={selectedPlatforms}
              setSelectedPlatforms={setSelectedPlatforms}
            />

            <CustomLinksInput
              customLinks={customLinks}
              setCustomLinks={setCustomLinks}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Eopen;

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fafafa' },
  profileInputSection: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
});
