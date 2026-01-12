import api from '../../../../../../services/api';
import { Platform } from 'react-native';

// Check if file is local (iOS + Android)
export const isLocalFile = file => {
  console.log('==============================');
  console.log('🔍 isLocalFile CHECK START');
  console.log('📦 Raw input:', file);

  if (!file) {
    console.log('❌ file is null or undefined → RETURN false');
    console.log('==============================');
    return false;
  }

  // Step 1: Extract URI safely
  const uri =
    typeof file === 'string'
      ? file
      : typeof file?.uri === 'string'
      ? file.uri
      : '';

  console.log('📄 Extracted URI:', uri || '(empty)');

  if (!uri) {
    console.log('❌ URI is empty → RETURN false');
    console.log('==============================');
    return false;
  }

  // Step 2: Block server files
  if (uri.startsWith('/uploads')) {
    console.log('🚫 Server file (/uploads) → RETURN false');
    console.log('==============================');
    return false;
  }

  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    console.log('🚫 Remote URL (http/https) → RETURN false');
    console.log('==============================');
    return false;
  }

  // Step 3: Check allowed local formats
  if (uri.startsWith('file://')) {
    console.log('✅ Local file detected (file://)');
    console.log('==============================');
    return true;
  }

  if (uri.startsWith('content://')) {
    console.log('✅ Local Android file detected (content://)');
    console.log('==============================');
    return true;
  }

  if (uri.startsWith('/')) {
    console.log('⚠️ Absolute path detected (/) – treating as LOCAL');
    console.log('==============================');
    return true;
  }

  // Step 4: Fallback
  console.log('❌ Not a local file → RETURN false');
  console.log('==============================');
  return false;
};

// Normalize URI for upload (iOS + Android)
export const normalizeFileUri = uri => {
  console.log('------------------------------');
  console.log('🔍 normalizeFileUri START');
  console.log('📥 Input URI:', uri);
  console.log('📱 Platform:', Platform.OS);

  if (!uri) {
    console.log('❌ URI is empty or null → returning null');
    console.log('------------------------------');
    return null;
  }

  // iOS handling
  if (Platform.OS === 'ios') {
    if (uri.startsWith('file://')) {
      console.log('✅ iOS: URI already has file://');
      console.log('📤 Output URI:', uri);
      console.log('------------------------------');
      return uri;
    } else {
      const fixedUri = `file://${uri}`;
      console.log('🔧 iOS: Added file:// prefix');
      console.log('📤 Output URI:', fixedUri);
      console.log('------------------------------');
      return fixedUri;
    }
  }

  // Android handling
  console.log('✅ Android: URI used as-is');
  console.log('📤 Output URI:', uri);
  console.log('------------------------------');
  return uri;
};
// Guess MIME type from extension
export const getMimeType = filename => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

// Upload file
export const uploadFile = async (file, type, accessToken) => {
  console.log('==============================');
  console.log('🚀 UPLOAD START');
  console.log('📦 Upload type:', type);
  console.log('📁 Raw file input:', file);

  // ✅ Normalize string → object
  const fileObj = typeof file === 'string' ? { uri: file } : file;

  if (!fileObj?.uri) {
    console.log('❌ STOP: file.uri is missing');
    console.log('==============================');
    return null;
  }

  const normalizedUri = normalizeFileUri(fileObj.uri);
  console.log('🔄 Normalized URI:', normalizedUri);

  const fileName =
    fileObj.name ||
    fileObj.fileName ||
    fileObj.displayName ||
    normalizedUri.split('/').pop() ||
    `upload-${Date.now()}.jpg`;

  const mimeType = fileObj.type || getMimeType(fileName);

  console.log('📝 File name:', fileName);
  console.log('🧾 MIME type:', mimeType);

  const formData = new FormData();
  formData.append('file', {
    uri: normalizedUri,
    name: fileName,
    type: mimeType,
  });
  formData.append('type', type);

  console.log('📡 Sending upload request...');

  const res = await api.post(`/api/user/upload?type=${type}`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  console.log('📨 Upload response:', res.data);
  console.log('==============================');

  return res?.data?.url || res?.data?.path || res?.data?.fileUrl || null;
};

// Document normalizer
export const normalizeDocuments = (docs = []) => {
  if (!Array.isArray(docs)) return [];

  return docs.map(doc => ({
    url: doc.url || doc.uri,
    name: doc.name ?? doc.displayName ?? '',
  }));
};

// Upload all documents if local
export const handleDocumentUploads = async (docs = [], type, accessToken) => {
  console.log('uploding triger doc');
  if (!Array.isArray(docs) || docs.length === 0) {
    return [];
  }

  const uploaded = [];

  for (const doc of docs) {
    const isLocal = isLocalFile(doc);
    const name = doc?.name ?? doc?.displayName ?? '';

    if (isLocal) {
      const url = await uploadFile(doc, type, accessToken);
      if (url) {
        uploaded.push({ name, url });
      }
    } else {
      uploaded.push({
        name,
        url: doc?.url || doc?.uri,
      });
    }
  }

  return uploaded;
};

// Deep equality checker (used for diff)
export const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export const areDocumentsEqual = (a = [], b = []) => {
  if (a.length !== b.length) return false;

  const mapA = new Map(a.map(d => [d.url, d.name || '']));
  const mapB = new Map(b.map(d => [d.url, d.name || '']));

  for (const [url, name] of mapA) {
    if (!mapB.has(url)) return false;
    if (mapB.get(url) !== name) return false;
  }

  return true;
};

// Build update payload (compare with original)
export const buildProfileUpdatePayload = ({
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
}) => {
  const updates = {};

  const safeNormalize = val => {
    if (val === undefined || val === null) {
      return '';
    }
    return typeof val === 'object' ? val : String(val).trim();
  };

  const currentFields = {
    name,
    bio,
    gender: gender || '',
    birth_year: birthYear,
    upi_id: upiId,
    namelocation,
    phone_number: phoneNumber,
    email,
    emergency_number: emergencyNumber,
    status_type: status,
    fillone: fillOne,
    filltwo: fillTwo,
    social_accounts: socialAccounts || {},
    address: pickedAddress,
    lat: pickedLocation?.latitude,
    lng: pickedLocation?.longitude,
    custom_links: customLinks,
    selected_languages: selectedLanguages,
  };

  for (const [key, currentVal] of Object.entries(currentFields)) {
    const originalVal = originalProfile?.[key];
    const originalNorm = safeNormalize(originalVal);
    const currentNorm = safeNormalize(currentVal);

    if (!deepEqual(originalNorm, currentNorm)) {
      updates[key] = currentVal;
    }
  }

  // Handle null location
  if (originalProfile?.lat && !pickedLocation) {
    updates.lat = null;
  }
  if (originalProfile?.lng && !pickedLocation) {
    updates.lng = null;
  }
  if (originalProfile?.address && !pickedAddress) {
    updates.address = '';
  }

  // Images
  if (typeof profileImageUrl !== 'undefined') {
    const original = originalProfile?.profile_image;
    if (profileImageUrl === null && original) {
      updates.profile_image = null;
    } else if (profileImageUrl && profileImageUrl !== original) {
      updates.profile_image = profileImageUrl;
    }
  }

  if (typeof coverImageUrl !== 'undefined') {
    const original = originalProfile?.cover_image;
    if (coverImageUrl === null && original) {
      updates.cover_image = null;
    } else if (coverImageUrl && coverImageUrl !== original) {
      updates.cover_image = coverImageUrl;
    }
  }

  // Documents
  if (typeof uploadedDocs !== 'undefined') {
    const normalizedOriginalDocs = normalizeDocuments(
      originalProfile?.documents,
    );

    if (!areDocumentsEqual(normalizedOriginalDocs, uploadedDocs)) {
      updates.documents = uploadedDocs;
    }
  }

  return updates;
};

// Upload types
export const UploadTypes = {
  PROFILE_IMAGE: 'profileImage',
  COVER_IMAGE: 'coverImage',
  DOCUMENT: 'document',
};
