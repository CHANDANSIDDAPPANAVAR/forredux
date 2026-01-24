import React, { useEffect, useState, useCallback, useRef } from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderProfileSimple from './Components/Opennetwork/HeaderProfileSimple';
import CoverImagePicker from './Components/Opennetwork/Coverimageuplod';
import ProfileImagePicker from './Components/Opennetwork/ProfileImagePicker';
import NameInput from './Components/Opennetwork/NameInput';
import LocationInput from './Components/Opennetwork/LocationInput';
import BioInput from './Components/Opennetwork/Bioinput';
import GenderDobInput from './Components/Opennetwork/dobgender';
import ProffExperienceInfo from './Components/proff/proffexpinoinput';
import Experienceinput from './Components/proff/experienceinput';
import Serviceinput from './Components/proff/serviceinput';
import LanguagesSpokenSelector from './Components/Opennetwork/langauges';
import BasicContactInfo from './Components/Opennetwork/contactinfo';
import Avilability from './Components/proff/Avilability';
import ProfileFileScreen from './Components/Opennetwork/documentsuplod';
import LocationSection from './Components/Opennetwork/LocationSection';
import UpiInput from './Components/Opennetwork/UpiInput';
import SocialMediaInputs from './Components/Opennetwork/someinput';
import CustomLinksInput from './Components/Opennetwork/costoumlink';
import KeywordInput from './Components/proff/keywords';
import GalleryInput from './Components/proff/galaryinput';

import api from '../../../../../services/api';

import {
  uploadFile,
  handleDocumentUploads,
  handleGalleryUploads,
  isLocalFile,
  UploadTypes,
  normalizeDocuments,
} from './uplods/profffileUploadUtils';

import { buildProfileUpdatePayload } from './uplods/PayloadUtilsproff';
import {
  saveProfileToCache,
  saveLastUpdatedToCache,
} from '../profilestore/Asystore';
import ConfirmModal from '../../../../util/alerts/ConfirmModal';

const Eserv = () => {
  const navigation = useNavigation();
  const { accessToken } = useSelector(state => state.auth);
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const pendingNavActionRef = useRef(null);
  const savingRef = useRef(false);

  const [hydrated, setHydrated] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  /* ---------------- STATE ---------------- */
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');

  const [namelocation, setNameLocation] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [services, setServices] = useState('');
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

  /* ---------------- LOAD PROFILE (SAFE HYDRATION) ---------------- */
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

      setNameLocation(prev => (prev !== '' ? prev : data.namelocation || ''));
      setBio(prev => (prev !== '' ? prev : data.bio || ''));
      setGender(prev => (prev !== '' ? prev : data.gender || ''));
      setBirthYear(prev =>
        prev !== '' ? prev : data.birth_year ? String(data.birth_year) : '',
      );

      setSelectedSkills(prev =>
        prev.length ? prev : data.selected_skills || '',
      );
      setExperience(prev =>
        prev !== ''
          ? prev
          : data.year_of_experience
          ? String(data.year_of_experience)
          : '',
      );

      setKeywords(prev => (prev.length ? prev : data.keywords || []));
      setServices(prev => (prev !== '' ? prev : data.services || ''));
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
  }, [accessToken, hydrated, pickedLocation]);
  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = e => {
        if (!isDirty || savingRef.current) return;

        e.preventDefault();
        pendingNavActionRef.current = e.data.action;
        setShowUnsavedModal(true);
      };

      navigation.addListener('beforeRemove', onBeforeRemove);
      return () => navigation.removeListener('beforeRemove', onBeforeRemove);
    }, [navigation, isDirty]),
  );
  useEffect(() => {
    if (!hydrated || !originalProfile) return;

    const updates = buildProfileUpdatePayload({
      originalProfile,
      profileData: {
        name,
        namelocation,
        bio,
        gender,
        birthYear,
        selectedSkills,
        experience,
        keywords,
        services,
        availability,
        selectedLanguages,
        phoneNumber,
        email,
        emergencyNumber,
        upiId,
        socialAccounts,
        customLinks,
        pickedLocation,
        pickedAddress,
      },
      profileImageUrl:
        profileImage === null
          ? null
          : isLocalFile(profileImage)
          ? 'LOCAL'
          : originalProfile.profile_image,
      coverImageUrl:
        coverImage === null
          ? null
          : isLocalFile(coverImage)
          ? 'LOCAL'
          : originalProfile.cover_image,
      uploadedDocs: documents,
      uploadedGallery: galleryImages,
    });

    setIsDirty(Object.keys(updates).length > 0);
  }, [
    hydrated,
    originalProfile,
    name,
    namelocation,
    bio,
    gender,
    birthYear,
    selectedSkills,
    experience,
    keywords,
    services,
    availability,
    selectedLanguages,
    phoneNumber,
    email,
    emergencyNumber,
    upiId,
    socialAccounts,
    customLinks,
    pickedLocation,
    pickedAddress,
    profileImage,
    coverImage,
    documents,
    galleryImages,
  ]);

  /* ---------------- SAVE ---------------- */
  const handleSave = useCallback(async () => {
    if (savingRef.current) return;
    savingRef.current = true;

    if (!accessToken || !originalProfile) return;

    setLoading(true);
    setIsSuccess(false);
    await delay(2000);
    try {
      let profileImageUrl;

      if (profileImage === null) {
        // User removed image
        profileImageUrl = null;
      } else if (isLocalFile(profileImage)) {
        // New image selected
        profileImageUrl = await uploadFile(
          profileImage,
          UploadTypes.PROFILE_IMAGE,
          accessToken,
        );
      } else {
        // Existing remote image
        profileImageUrl = originalProfile.profile_image;
      }

      let coverImageUrl;

      if (coverImage === null) {
        coverImageUrl = null;
      } else if (isLocalFile(coverImage)) {
        coverImageUrl = await uploadFile(
          coverImage,
          UploadTypes.COVER_IMAGE,
          accessToken,
        );
      } else {
        coverImageUrl = originalProfile.cover_image;
      }
      let uploadedDocs = normalizeDocuments(documents);
      const localDocs = documents.filter(d => d && d.uri && isLocalFile(d));

      if (localDocs.length > 0) {
        uploadedDocs = await handleDocumentUploads(
          documents,
          UploadTypes.DOCUMENT,
          accessToken,
        );
      }

      let uploadedGallery = galleryImages;
      if (galleryImages.some(isLocalFile)) {
        uploadedGallery = await handleGalleryUploads(
          galleryImages,
          UploadTypes.GALLERY_IMAGE,
          accessToken,
        );
      }

      const updates = buildProfileUpdatePayload({
        originalProfile,
        profileData: {
          name,
          namelocation,
          bio,
          gender,
          birthYear,
          selectedSkills,
          experience,
          keywords,
          services,
          availability,
          selectedLanguages,
          phoneNumber,
          email,
          emergencyNumber,
          upiId,
          socialAccounts,
          customLinks,
          pickedLocation,
          pickedAddress,
        },
        profileImageUrl,
        coverImageUrl,
        uploadedDocs,
        uploadedGallery,
      });

      if (!Object.keys(updates).length) {
        setAlertTitle('No Changes');
        setAlertMessage('Your profile is already up to date.');
        setAlertVisible(true);
        return;
      }

      const res = await api.patch('/api/user/upserviceProfile', updates);

      await saveProfileToCache(res.data);
      await saveLastUpdatedToCache(res.data.updated_at);

      setIsSuccess(true);
      setIsDirty(false);

      setAlertTitle('Success');
      setAlertMessage('Profile updated successfully.');
      setAlertVisible(true);
    } catch {
      setAlertTitle('Error');
      setAlertMessage('Something went wrong. Please try again.');
      setAlertVisible(true);
    } finally {
      savingRef.current = false;
      setLoading(false);
    }
  }, [
    accessToken,
    originalProfile,
    coverImage,
    profileImage,
    name,
    namelocation,
    bio,
    gender,
    birthYear,
    selectedSkills,
    experience,
    keywords,
    services,
    availability,
    selectedLanguages,
    phoneNumber,
    email,
    emergencyNumber,
    upiId,
    socialAccounts,
    customLinks,
    pickedLocation,
    pickedAddress,
    documents,
    galleryImages,
  ]);
  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <HeaderProfileSimple title="My Service Identity" />

        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <CoverImagePicker
            coverImage={coverImage}
            setCoverImage={setCoverImage}
          />
          <ProfileImagePicker
            profileImage={profileImage}
            setProfileImage={setProfileImage}
          />
          <View style={styles.profileInputSection}>
            <NameInput name={name} setName={setName} />

            <LocationInput
              Namelocation={namelocation}
              setNameLocation={setNameLocation}
            />
            <BioInput type="service" bio={bio} setBio={setBio} />
            <GenderDobInput
              gender={gender}
              setGender={setGender}
              birthYear={birthYear}
              setBirthYear={setBirthYear}
            />
            <ProffExperienceInfo
              type="service"
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
            />
            <Experienceinput value={experience} onChange={setExperience} />
            <Serviceinput value={services} onChange={setServices} />
            <GalleryInput
              galleryImages={galleryImages}
              setGalleryImages={setGalleryImages}
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
            <KeywordInput keywords={keywords} setKeywords={setKeywords} />
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
        <ConfirmModal
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onConfirm={() => {
            setAlertVisible(false);
            if (isSuccess) navigation.replace('Profile');
          }}
          onCancel={() => setAlertVisible(false)}
        />
        <ConfirmModal
          visible={showUnsavedModal}
          title="Unsaved Changes"
          message="You have unsaved changes. Do you want to discard them?"
          confirmText="discard"
          onConfirm={() => {
            setShowUnsavedModal(false);
            if (pendingNavActionRef.current) {
              navigation.dispatch(pendingNavActionRef.current);
              pendingNavActionRef.current = null;
            }
          }}
          onCancel={() => {
            setShowUnsavedModal(false);
            pendingNavActionRef.current = null;
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Eserv;

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
