/* ----------------------------------
   HELPERS
----------------------------------- */
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const normalizePrimitive = v =>
  v === undefined || v === null ? '' : String(v).trim();

const normalizeArray = v => (Array.isArray(v) ? v : []);
const normalizeObject = v =>
  v && typeof v === 'object' && !Array.isArray(v) ? v : {};

const normalizeDocs = docs =>
  Array.isArray(docs)
    ? docs.map(d => ({
        name: String(d.name || ''),
        url: String(d.url || ''),
      }))
    : [];

/* ----------------------------------
   PAYLOAD BUILDER
----------------------------------- */
export const buildProfileUpdatePayload = ({
  originalProfile,
  profileData,
  profileImageUrl,
  coverImageUrl,
  uploadedDocs,
  uploadedGallery,
}) => {
  const updates = {};

  /* -------- Primitive fields -------- */
  const primitiveFields = {
    name: profileData.name,
    tagline: profileData.tagline,
    bio: profileData.bio,
    gender: profileData.gender,
    birth_year: profileData.birthYear,
    namelocation: profileData.namelocation,
    phone_number: profileData.phoneNumber,
    email: profileData.email,
    emergency_number: profileData.emergencyNumber,
    upi_id: profileData.upiId,
    company_name: profileData.companyName,
    services: profileData.services,
    year_of_experience: profileData.experience,
    address: profileData.pickedAddress,
    latitude: profileData.pickedLocation?.latitude,
    longitude: profileData.pickedLocation?.longitude,
  };

  Object.entries(primitiveFields).forEach(([key, value]) => {
    if (
      normalizePrimitive(value) !== normalizePrimitive(originalProfile?.[key])
    ) {
      updates[key] = value ?? null;
    }
  });

  /* -------- Array fields -------- */
  const arrayFields = {
    keywords: profileData.keywords,
    selected_skills: profileData.selectedSkills,
    selected_certifications: profileData.selectedCerts,
    selected_languages: profileData.selectedLanguages,
    availability: profileData.availability,
    custom_links: profileData.customLinks,
  };

  Object.entries(arrayFields).forEach(([key, value]) => {
    if (
      !deepEqual(normalizeArray(value), normalizeArray(originalProfile?.[key]))
    ) {
      updates[key] = normalizeArray(value);
    }
  });

  /* -------- Object fields -------- */
  if (
    !deepEqual(
      normalizeObject(profileData.socialAccounts),
      normalizeObject(originalProfile?.social_accounts),
    )
  ) {
    updates.social_accounts = normalizeObject(profileData.socialAccounts);
  }

  /* -------- Profile Image -------- */

  if (profileImageUrl !== undefined) {
    console.log('in play boled', profileImageUrl);
    if (profileImageUrl !== originalProfile?.profile_image) {
      updates.profile_image = profileImageUrl || null;
    }
  }

  /* -------- Cover Image -------- */
  console.log(coverImageUrl);
  if (coverImageUrl !== undefined) {
    if (coverImageUrl !== originalProfile?.cover_image) {
      updates.cover_image = coverImageUrl || null;
    }
  }

  /* -------- Documents -------- */
  if (uploadedDocs !== undefined) {
    if (
      !deepEqual(
        normalizeDocs(uploadedDocs),
        normalizeDocs(originalProfile?.documents),
      )
    ) {
      updates.documents = uploadedDocs;
    }
  }

  /* -------- Gallery -------- */
  if (uploadedGallery !== undefined) {
    if (
      !deepEqual(
        normalizeDocs(uploadedGallery),
        normalizeDocs(originalProfile?.gallery_images),
      )
    ) {
      updates.gallery_images = uploadedGallery;
    }
  }

  return updates;
};
