import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import HeaderProfileSimple from './Components/Opennetwork/HeaderProfileSimple';
import CoverImagePicker from './Components/Opennetwork/Coverimageuplod';
import ProfileImageprofinput from './Components/proff/proffprofile';
import NameInput from './Components/Opennetwork/NameInput';
import GenderDobInput from './Components/Opennetwork/dobgender';
import LocationInput from './Components/Opennetwork/LocationInput';
import BioInput from './Components/Opennetwork/Bioinput';
import ProffExperienceInfo from './Components/proff/proffexpinoinput';
import Experienceinput from './Components/proff/experienceinput';
import CertificationDegreesInfo from './Components/proff/certificationDegree';
import CompanyBusiness from './Components/proff/CompanyBusiness';
import KeywordInput from './Components/proff/keywords';
import Serviceinput from './Components/proff/serviceinput';
import GalleryInput from './Components/proff/galaryinput';
import Avilability from './Components/proff/Avilability';
import Tagline from './Components/proff/tagline';
import LanguagesSpokenSelector from './Components/Opennetwork/langauges';
import BasicContactInfo from './Components/Opennetwork/contactinfo';
import LocationSection from './Components/Opennetwork/LocationSection';
import UpiInput from './Components/Opennetwork/UpiInput';
import SocialMediaInputs from './Components/Opennetwork/someinput';
import CustomLinksInput from './Components/Opennetwork/costoumlink';
import ProfileFileScreen from './Components/Opennetwork/documentsuplod';
import ConfirmModal from '../../../../util/alerts/ConfirmModal';

import api from '../../../../../services/api';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';

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

const Eproff = () => {
  const navigation = useNavigation();
  const { accessToken } = useSelector(state => state.auth);

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
  const [tagline, setTagline] = useState('');
  const [namelocation, setNameLocation] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState('');
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [companyName, setCompanyName] = useState('');
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
      setTagline(prev => (prev !== '' ? prev : data.tagline || ''));
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
      setSelectedCerts(prev =>
        prev.length ? prev : data.selected_certifications || [],
      );
      setCompanyName(prev => (prev !== '' ? prev : data.company_name || ''));
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

  /* ---------------- SAVE ---------------- */
  const handleSave = useCallback(async () => {
    if (!accessToken || !originalProfile) return;

    setLoading(true);
    setIsSuccess(false);

    try {
      let profileImageUrl = originalProfile.profile_image || null;
      let coverImageUrl = originalProfile.cover_image || null;

      console.log('🧪 INITIAL profileImage:', profileImage);
      console.log('🧪 INITIAL coverImage:', coverImage);

      // ---------- PROFILE IMAGE ----------
      if (profileImage) {
        console.log('➡️ profileImage.uri:', profileImage);
        console.log(
          '➡️ isLocalFile(profileImage.uri):',
          isLocalFile(profileImage),
        );

        if (isLocalFile(profileImage)) {
          console.log('⬆️ Uploading PROFILE image...');
          const uploaded = await uploadFile(
            profileImage,
            UploadTypes.PROFILE_IMAGE,
            { accessToken },
          );

          console.log('✅ Uploaded PROFILE image URL:', uploaded);
          profileImageUrl = uploaded || profileImageUrl;
        } else {
          console.log('⏭ PROFILE image is NOT local, skipping upload');
        }
      } else {
        console.log('❌ profileImage is null');
      }

      // ---------- COVER IMAGE ----------
      if (coverImage) {
        console.log('➡️ coverImage.uri:', coverImage);
        console.log('➡️ isLocalFile(coverImage.uri):', isLocalFile(coverImage));

        if (isLocalFile(coverImage)) {
          console.log('⬆️ Uploading COVER image...');
          const uploaded = await uploadFile(
            coverImage,
            UploadTypes.COVER_IMAGE,
            { accessToken },
          );

          console.log('✅ Uploaded COVER image URL:', uploaded);
          coverImageUrl = uploaded || coverImageUrl;
        } else {
          console.log('⏭ COVER image is NOT local, skipping upload');
        }
      } else {
        console.log('❌ coverImage is null');
      }

      console.log('📦 FINAL profileImageUrl:', profileImageUrl);
      console.log('📦 FINAL coverImageUrl:', coverImageUrl);

      let uploadedDocs = normalizeDocuments(documents);
      if (documents.some(d => isLocalFile(d.uri))) {
        uploadedDocs = await handleDocumentUploads(
          documents,
          UploadTypes.DOCUMENT,
          { accessToken },
        );
      }

      let uploadedGallery = galleryImages;
      if (galleryImages.some(g => isLocalFile(g.uri))) {
        uploadedGallery = await handleGalleryUploads(
          galleryImages,
          UploadTypes.GALLERY_IMAGE,
          { accessToken },
        );
      }

      const updates = buildProfileUpdatePayload({
        originalProfile,
        profileData: {
          name,
          tagline,
          namelocation,
          bio,
          gender,
          birthYear,
          selectedSkills,
          experience,
          selectedCerts,
          companyName,
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

      const res = await api.patch('/api/user/ProffprofileProfile', updates, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await saveProfileToCache(res.data);
      await saveLastUpdatedToCache(res.data.updated_at);

      setIsSuccess(true);
      setAlertTitle('Success');
      setAlertMessage('Profile updated successfully.');
      setAlertVisible(true);
    } catch {
      setAlertTitle('Error');
      setAlertMessage('Something went wrong. Please try again.');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    originalProfile,
    coverImage,
    profileImage,
    name,
    tagline,
    namelocation,
    bio,
    gender,
    birthYear,
    selectedSkills,
    experience,
    selectedCerts,
    companyName,
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

  /* ---------------- UI ---------------- */
  console.log(coverImage);
  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <HeaderProfileSimple title="My Professional Identity" />

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
            <NameInput name={name} setName={setName} />
            <Tagline tagline={tagline} setTagline={setTagline} />
            <LocationInput
              Namelocation={namelocation}
              setNameLocation={setNameLocation}
            />
            <BioInput bio={bio} setBio={setBio} />
            <GenderDobInput
              gender={gender}
              setGender={setGender}
              birthYear={birthYear}
              setBirthYear={setBirthYear}
            />
            <ProffExperienceInfo
              selectedSkills={selectedSkills}
              setSelectedSkills={setSelectedSkills}
            />
            <Experienceinput value={experience} onChange={setExperience} />
            <CertificationDegreesInfo
              selectedCerts={selectedCerts}
              setSelectedCerts={setSelectedCerts}
            />
            <CompanyBusiness
              companyName={companyName}
              setCompanyName={setCompanyName}
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
            <KeywordInput keywords={keywords} setKeywords={setKeywords} />
            <Serviceinput value={services} onChange={setServices} />
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Eproff;

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
