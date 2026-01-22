import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderProfileSimple from './Components/Opennetwork/HeaderProfileSimple';
import CoverImagePicker from './Components/Opennetwork/Coverimageuplod';
import ProfileImageprofinput from './Components/proff/proffprofile';
import NameInput from './Components/Opennetwork/NameInput';
import ProffExperienceInfo from './Components/proff/proffexpinoinput';
import GenderDobInput from './Components/Opennetwork/dobgender';
import LocationInput from './Components/Opennetwork/LocationInput';
import BioInput from './Components/Opennetwork/Bioinput';
import Tagline from './Components/proff/tagline';
import LanguagesSpokenSelector from './Components/Opennetwork/langauges';
import BasicContactInfo from './Components/Opennetwork/contactinfo';
import KeywordInput from './Components/proff/keywords';
import GalleryInput from './Components/proff/galaryinput';
import Avilability from './Components/proff/Avilability';
import ProfileFileScreen from './Components/Opennetwork/documentsuplod';
import LocationSection from './Components/Opennetwork/LocationSection';
import UpiInput from './Components/Opennetwork/UpiInput';
import SocialMediaInputs from './Components/Opennetwork/someinput';
import CustomLinksInput from './Components/Opennetwork/costoumlink';
const Ebuss = () => {
  const { accessToken } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [birthYear, setBirthYear] = useState('');
  const [namelocation, setNameLocation] = useState('');
  const [bio, setBio] = useState('');
  const [tagline, setTagline] = useState('');
  const [keywords, setKeywords] = useState([]);

  const [galleryImages, setGalleryImages] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyNumber, setEmergencyNumber] = useState('');
  const [documents, setDocuments] = useState([]);
  const [upiId, setUpiId] = useState('');
  const [socialAccounts, setSocialAccounts] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [customLinks, setCustomLinks] = useState([]);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [pickedAddress, setPickedAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLocationSelected = useCallback(location => {
    setPickedLocation(location);
    setModalVisible(false);
  }, []);

  useEffect(() => {
    if (!accessToken || hydrated) return;

    let mounted = true;

    const load = async () => {
      const data = await fetchAndCacheProfile(accessToken);
      if (!mounted || !data) return;

      setOriginalProfile(data);

      setCoverImage(prev => prev ?? data.cover_image ?? null);
      setProfileImage(prev => prev ?? data.profile_image ?? null);
      setName(prev => (prev !== '' ? prev : data.name || ''));
      setSelectedSkills(prev =>
        prev.length ? prev : data.selected_skills || '',
      );
      setBirthYear(prev =>
        prev !== '' ? prev : data.birth_year ? String(data.birth_year) : '',
      );
      setNameLocation(prev => (prev !== '' ? prev : data.namelocation || ''));
      setBio(prev => (prev !== '' ? prev : data.bio || ''));
      setTagline(prev => (prev !== '' ? prev : data.tagline || ''));
      setKeywords(prev => (prev.length ? prev : data.keywords || []));

      // ⬇️ inside load()
      if (!hydrated) {
        setGalleryImages(
          Array.isArray(data.gallery_images) ? data.gallery_images : [],
        );
      }

      setAvailability(prev => (prev.length ? prev : data.availability || []));
      setSelectedLanguages(prev =>
        prev.length ? prev : data.selected_languages || [],
      );

      setPhoneNumber(prev => (prev !== '' ? prev : data.phone_number || ''));
      setEmail(prev => (prev !== '' ? prev : data.email || ''));
      setEmergencyNumber(prev =>
        prev !== '' ? prev : data.emergency_number || '',
      );
      setDocuments(prev => (prev.length ? prev : data.documents || []));
      setUpiId(prev => (prev !== '' ? prev : data.upi_id || ''));

      setSocialAccounts(prev =>
        Object.keys(prev).length ? prev : data.social_accounts || {},
      );
      setSelectedPlatforms(prev =>
        prev.length ? prev : Object.keys(data.social_accounts || {}),
      );
      setCustomLinks(prev =>
        prev.length
          ? prev
          : Array.isArray(data.custom_links)
          ? data.custom_links
          : [],
      );

      setPickedAddress(prev => (prev !== '' ? prev : data.address || ''));

      if (data.latitude && data.longitude && !pickedLocation) {
        setPickedLocation({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
      setHydrated(true);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [accessToken, hydrated]);

  const handleSave = () => {};
  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <HeaderProfileSimple title="My Business Identity" />

        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CoverImagePicker
            coverImage={coverImage}
            setCoverImage={setCoverImage}
          />
          <ProfileImageprofinput
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <View style={styles.profileInputSection}>
            <NameInput
              name={name}
              setName={setName}
              label="Business Name"
              placeholder="Enter Business name"
            />
            <Tagline
              type="business"
              tagline={tagline}
              setTagline={setTagline}
            />
            <ProffExperienceInfo
              type="business"
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
            />
            <GenderDobInput
              type="business"
              birthYear={birthYear}
              setBirthYear={setBirthYear}
            />
            <LocationInput
              Namelocation={namelocation}
              setNameLocation={setNameLocation}
            />
            <BioInput type="business" bio={bio} setBio={setBio} />

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
            <KeywordInput keywords={keywords} setKeywords={setKeywords} />

            <GalleryInput
              galleryImages={galleryImages}
              setGalleryImages={setGalleryImages}
            />
            <Avilability
              availability={availability}
              setAvailability={setAvailability}
            />
            <ProfileFileScreen
              onFilesPicked={setDocuments}
              initialFile={documents}
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

        <View style={styles.saveWrapper}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Ebuss;

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fafafa' },
  profileInputSection: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  saveWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
