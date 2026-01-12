import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
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

import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import CompanyBusiness from './Components/proff/CompanyBusiness';
import KeywordInput from './Components/proff/keywords';
import Serviceinput from './Components/proff/serviceinput';
import GalleryInput from './Components/proff/galaryinput';
import AvailabilitySection from '../Sparts/Business/AvailabilitySection';
import Avilability from './Components/proff/Avilability';

const Eproff = () => {
  const navigation = useNavigation();
  const { accessToken } = useSelector(state => state.auth);

  const [hydrated, setHydrated] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [namelocation, setNameLocation] = useState('');
  const [gender, setGender] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [bio, setBio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [experience, setExperience] = useState('');
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [services, setServices] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [availability, setAvailability] = useState([]);
  useEffect(() => {
    if (!accessToken || hydrated) return;

    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await fetchAndCacheProfile(accessToken);
        if (!isMounted || !data) return;

        setOriginalProfile(data);

        setCoverImage(data.cover_image ?? null);
        setProfileImage(data.profile_image ?? null);
        setName(data.name ?? '');
        setNameLocation(data.namelocation ?? '');
        setGender(data.gender ?? '');
        setBirthYear(data.birth_year ? String(data.birth_year) : '');
        setBio(data.bio ?? '');

        setSelectedSkills(
          Array.isArray(data.selected_skills) ? data.selected_skills : [],
        );

        setExperience(
          data.year_of_experience ? String(data.year_of_experience) : '',
        );

        setSelectedCerts(
          Array.isArray(data.selected_certifications)
            ? data.selected_certifications
            : [],
        );
        setCompanyName(data.company_name ?? '');
        setKeywords(Array.isArray(data.keywords) ? data.keywords : []);
        setGalleryImages(
          Array.isArray(data.gallery_images) ? data.gallery_images : [],
        );
        setAvailability(
          Array.isArray(data.availability) ? data.availability : [],
        );
        setServices(data.services ?? '');
        setHydrated(true);
      } catch {
        // silent fail in production
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [accessToken, hydrated]);

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
            navigation={navigation}
          />

          <ProfileImageprofinput
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Eproff;

/* ----------------------------------
   STYLES
----------------------------------- */
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  profileInputSection: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
});
