import React, { useEffect, useState, useCallback } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Text,
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

import api from '../../../../../services/api';
import {
  saveProfileToCache,
  saveLastUpdatedToCache,
} from '../profilestore/Asystore';
import {
  uploadFile,
  handleDocumentUploads,
  buildProfileUpdatePayload,
  normalizeDocuments,
  isLocalFile,
  UploadTypes,
} from './uplods/profileUploadUtils';
import ConfirmModal from '../../../../util/alerts/ConfirmModal';

const Eopen = () => {
  const navigation = useNavigation();
  const { accessToken } = useSelector(state => state.auth);

  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const [hydrated, setHydrated] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

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
  const [documents, setDocuments] = useState([]); // ← always array

  const [socialAccounts, setSocialAccounts] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [customLinks, setCustomLinks] = useState([]);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [pickedAddress, setPickedAddress] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [upiId, setUpiId] = useState('');

  const handleLocationSelected = useCallback(location => {
    setPickedLocation(location);
    setModalVisible(false);
  }, []);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load profile (only once)
  useEffect(() => {
    if (!accessToken || hydrated) return;

    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await fetchAndCacheProfile(accessToken);
        if (!mounted || !data) return;

        setOriginalProfile(data);

        setCoverImage(data.cover_image ?? null);
        setProfileImage(data.profile_image ?? null);
        setName(data.name ?? '');
        setNameLocation(data.namelocation ?? '');
        setGender(data.gender ?? '');
        setBirthYear(data.birth_year ? String(data.birth_year) : '');
        setBio(data.bio ?? '');
        setStatus(data.status_type ?? '');
        setFillOne(data.fillone ?? '');
        setFillTwo(data.filltwo ?? '');
        setSelectedLanguages(
          Array.isArray(data.selected_languages) ? data.selected_languages : [],
        );
        setPhoneNumber(data.phone_number ?? '');
        setEmail(data.email ?? '');
        setEmergencyNumber(data.emergency_number ?? '');
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
        setUpiId(data.upi_id ?? '');

        // Social
        if (data.social_accounts) {
          const cleaned = Object.fromEntries(
            Object.entries(data.social_accounts).filter(
              ([, v]) => typeof v === 'string' && v.trim(),
            ),
          );
          setSocialAccounts(cleaned);
          setSelectedPlatforms(Object.keys(cleaned));
        }

        setCustomLinks(
          Array.isArray(data.custom_links) ? data.custom_links : [],
        );

        // Location
        if (data.lat && data.lng) {
          setPickedLocation({ latitude: data.lat, longitude: data.lng });
        }
        setPickedAddress(data.address ?? '');

        setHydrated(true);
      } catch (err) {
        console.error('Profile load error:', err);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [accessToken, hydrated]);

  const handleSave = useCallback(async () => {
    if (!accessToken || !originalProfile) return;

    setLoading(true);

    try {
      // 1️⃣ Start with server values
      let profileImageUrl = originalProfile.profile_image || null;
      let coverImageUrl = originalProfile.cover_image || null;

      // 2️⃣ Upload PROFILE image only if local
      if (isLocalFile(profileImage)) {
        const uploaded = await uploadFile(
          profileImage,
          UploadTypes.PROFILE_IMAGE,
          accessToken,
        );
        if (uploaded) {
          profileImageUrl = uploaded;
        }
      }

      // 3️⃣ Upload COVER image only if local
      if (isLocalFile(coverImage)) {
        const uploaded = await uploadFile(
          coverImage,
          UploadTypes.COVER_IMAGE,
          accessToken,
        );
        if (uploaded) {
          coverImageUrl = uploaded;
        }
      }

      // 4️⃣ Documents (WITH STEP-BY-STEP LOGS)
      let uploadedDocs = [];

      console.log('==============================');
      console.log('📄 DOCUMENT CHECK START');
      console.log('📦 documents raw value:', documents);
      console.log('📦 isArray:', Array.isArray(documents));
      console.log(
        '📦 length:',
        Array.isArray(documents) ? documents.length : 'N/A',
      );

      if (Array.isArray(documents) && documents.length > 0) {
        console.log('✅ Documents exist');

        const localCheck = documents.map((doc, index) => {
          const uri = doc?.uri || doc?.url;
          const isLocal = isLocalFile(doc);

          console.log(`📄 Doc[${index}]`);
          console.log('   uri:', uri);
          console.log('   isLocal:', isLocal);

          return isLocal;
        });

        const hasLocal = localCheck.some(Boolean);
        console.log('📌 Has at least one LOCAL document:', hasLocal);

        if (hasLocal) {
          console.log('🚀 Triggering DOCUMENT UPLOAD');
          uploadedDocs = await handleDocumentUploads(
            documents,
            UploadTypes.DOCUMENT,
            accessToken,
          );
        } else {
          console.log('📤 No local docs → using existing server docs');
          uploadedDocs = normalizeDocuments(documents);
        }
      } else {
        console.log('❌ No documents found');
      }

      console.log('📨 Final uploadedDocs payload:', uploadedDocs);
      console.log('==============================');

      // 5️⃣ Build diff payload
      const updates = buildProfileUpdatePayload({
        originalProfile,
        profileImageUrl,
        coverImageUrl,
        uploadedDocs,
        name,
        bio,
        status,
        fillOne,
        fillTwo,
        phoneNumber,
        email,
        emergencyNumber,
        upiId,
        gender,
        birthYear,
        socialAccounts,
        namelocation,
        pickedAddress,
        pickedLocation,
        customLinks,
        selectedLanguages,
      });

      // 6️⃣ No changes → stop
      if (Object.keys(updates).length === 0) {
        setAlertTitle('No Changes');
        setAlertMessage('Your profile is already up to date.');
        setAlertVisible(true);
        return;
      }

      // 7️⃣ Update profile
      const res = await api.patch('/api/user/updateProfile', updates, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      await saveProfileToCache(res.data);
      await saveLastUpdatedToCache(res.data.updated_at);

      setIsSuccess(true);
      setAlertTitle('Success');
      setAlertMessage('Profile updated successfully ✓');
      setAlertVisible(true);
    } catch (err) {
      setIsSuccess(false);
      setAlertTitle('Error');
      setAlertMessage(
        err?.response?.data?.message || 'Failed to update profile',
      );
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  }, [
    accessToken,
    originalProfile,
    profileImage,
    coverImage,
    documents,
    name,
    bio,
    status,
    fillOne,
    fillTwo,
    phoneNumber,
    email,
    emergencyNumber,
    upiId,
    gender,
    birthYear,
    socialAccounts,
    namelocation,
    pickedAddress,
    pickedLocation,
    customLinks,
    selectedLanguages,
  ]);

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
              onFilesPicked={setDocuments}
              initialFile={documents} // ← pass whole array
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

            if (isSuccess) {
              navigation.replace('Profile'); // 👈 target screen name
            }
          }}
          onCancel={() => setAlertVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fafafa' },
  profileInputSection: {
    paddingHorizontal: 20,
    paddingBottom: 140, // ← more space for save button
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

export default Eopen;
