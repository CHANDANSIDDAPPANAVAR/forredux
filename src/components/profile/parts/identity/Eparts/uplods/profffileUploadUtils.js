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
export const isLocalFile = uri => {
  if (!uri || typeof uri !== 'string') return false;
  console.log('is locla file', uri);
  return (
    uri.startsWith('file://') || // Android / iOS (wrapped)
    uri.startsWith('content://') || // Android
    uri.startsWith('/var/') || // iOS
    uri.startsWith('/private/var/') || // iOS
    uri.startsWith('/Users/') || // iOS simulator
    uri.startsWith('/storage/') || // Android
    uri.startsWith('/data/') // Android
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
export const uploadFile = async (file, type, auth) => {
  if (!file?.uri) return null;
  console.log('in uplodes', file, type);

  const token = auth?.accessToken || auth?.tokens?.accessToken;
  if (!token) return null;

  const name =
    file.name ||
    file.fileName ||
    file.uri.split('/').pop()?.split('?')[0] ||
    `upload-${Date.now()}`;

  const formData = new FormData();
  formData.append('file', {
    uri: normalizeUri(file.uri),
    name,
    type: file.type || getMimeType(name),
  });
  formData.append('type', type);

  const res = await api.post(`/api/user/upload?type=${type}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res?.data?.url || null;
};

/* ----------------------------------
   DOCUMENT UPLOADS
----------------------------------- */
export const handleDocumentUploads = async (docs = [], type, auth) => {
  if (!Array.isArray(docs) || docs.length === 0) return [];

  const uploaded = [];

  for (const doc of docs) {
    const name =
      doc.displayName || doc.name || doc.uri?.split('/').pop() || 'Untitled';

    if (isLocalFile(doc?.uri)) {
      const url = await uploadFile(doc, type, auth);
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
export const handleGalleryUploads = async (images = [], type, auth) => {
  if (!Array.isArray(images) || images.length === 0) return [];

  const uploaded = [];

  for (const img of images) {
    const name =
      img.name || img.uri?.split('/').pop() || `gallery-${Date.now()}`;

    if (isLocalFile(img?.uri)) {
      const url = await uploadFile(img, type, auth);
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
