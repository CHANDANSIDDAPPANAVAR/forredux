import { Platform } from 'react-native';
import api from '../../../../../../services/api';

/* ----------------------------------
   UPLOAD TYPES
----------------------------------- */
export const UploadTypes = {
  PROFILE_IMAGE: 'profileImage',
  COVER_IMAGE: 'coverImage',
  DOCUMENT: 'document',
  GALLERY_IMAGE: 'galleryImage',
};

/* ----------------------------------
   HELPERS
----------------------------------- */
export const isLocalFile = fileOrUri => {
  const uri = typeof fileOrUri === 'string' ? fileOrUri : fileOrUri?.uri;

  if (!uri || typeof uri !== 'string') return false;

  return (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    uri.startsWith('/var/') ||
    uri.startsWith('/private/var/') ||
    uri.startsWith('/Users/') ||
    uri.startsWith('/storage/') ||
    uri.startsWith('/data/')
  );
};

const normalizeUri = uri => {
  if (!uri) return '';
  if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
    return `file://${uri}`;
  }
  return uri;
};

const getMimeType = filename => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  const map = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
  };
  return map[ext] || 'application/octet-stream';
};

/* ----------------------------------
   FILE UPLOAD
----------------------------------- */
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

  const normalizedUri = normalizeUri(fileObj.uri);
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

/* ----------------------------------
   DOCUMENT UPLOADS
----------------------------------- */
export const handleDocumentUploads = async (docs = [], type, accessToken) => {
  if (!Array.isArray(docs) || docs.length === 0) return [];

  const uploaded = [];

  for (const doc of docs) {
    const name =
      doc.displayName || doc.name || doc.uri?.split('/').pop() || 'Untitled';

    if (isLocalFile(doc?.uri)) {
      const url = await uploadFile(doc, type, accessToken);
      if (url) uploaded.push({ name: String(name), url });
    } else if (doc?.url || doc?.uri) {
      uploaded.push({
        name: String(name),
        url: String(doc.url || doc.uri),
      });
    }
  }

  return uploaded;
};

/* ----------------------------------
   GALLERY UPLOADS
----------------------------------- */
export const handleGalleryUploads = async (images = [], type, accessToken) => {
  if (!Array.isArray(images) || images.length === 0) return [];

  const uploaded = [];

  for (const img of images) {
    const name =
      img.name || img.uri?.split('/').pop() || `gallery-${Date.now()}`;

    if (isLocalFile(img?.uri)) {
      const url = await uploadFile(img, type, accessToken);
      if (url) uploaded.push({ name: String(name), url });
    } else if (img?.url || img?.uri) {
      uploaded.push({
        name: String(name),
        url: String(img.url || img.uri),
      });
    }
  }

  return uploaded;
};

/* ----------------------------------
   NORMALIZERS
----------------------------------- */
export const normalizeDocuments = docs =>
  Array.isArray(docs)
    ? docs.filter(Boolean).map(doc => ({
        name: String(doc.displayName || doc.name || 'Untitled'),
        url: String(doc.url || doc.uri || ''),
      }))
    : [];

export const normalizeGallery = images =>
  Array.isArray(images)
    ? images.filter(Boolean).map(img => ({
        name: String(img.name || 'Untitled'),
        url: String(img.url || img.uri || ''),
      }))
    : [];
