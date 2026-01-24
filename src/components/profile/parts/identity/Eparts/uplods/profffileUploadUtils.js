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
  if (!fileOrUri) return false;

  const uri =
    typeof fileOrUri === 'string' ? fileOrUri : fileOrUri.uri || fileOrUri.url;

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
  const fileObj = typeof file === 'string' ? { uri: file } : file;
  if (!fileObj?.uri) return null;

  const normalizedUri = normalizeUri(fileObj.uri);

  const fileName =
    fileObj.name ||
    fileObj.fileName ||
    fileObj.displayName ||
    normalizedUri.split('/').pop() ||
    `upload-${Date.now()}`;

  const mimeType = fileObj.type || getMimeType(fileName);

  const formData = new FormData();
  formData.append('file', {
    uri: normalizedUri,
    name: fileName,
    type: mimeType,
  });

  const res = await api.post(`/api/user/upload?type=${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res?.data?.url || res?.data?.path || null;
};

/* ----------------------------------
   DOCUMENT UPLOADS
----------------------------------- */
export const handleDocumentUploads = async (docs = [], type, accessToken) => {
  if (!Array.isArray(docs) || docs.length === 0) return [];

  const uploaded = [];

  for (const doc of docs) {
    // 🔒 hard safety guard
    if (!doc || !doc.uri) continue;

    const name =
      doc.displayName || doc.name || doc.uri.split('/').pop() || 'Untitled';

    if (isLocalFile(doc)) {
      const url = await uploadFile(doc, type, accessToken);
      if (url) {
        uploaded.push({
          name: String(name),
          url: String(url),
        });
      }
    } else if (doc.url) {
      uploaded.push({
        name: String(name),
        url: String(doc.url),
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
