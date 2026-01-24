import { uploadFile, isLocalFile } from './coreUploadUtils';

export const UploadTypes = {
  PROFILE_EVENT: 'profileEvent',
  COVER_EVENT: 'coverEvent',
  DOCUMENT_EVENT: 'documentEvent',
  GALLERY_EVENT: 'galleryEvent',
};

export const uploadDocuments = async docs => {
  const out = [];
  for (const d of docs) {
    if (isLocalFile(d))
      out.push({
        name: d.name || 'Doc',
        url: await uploadFile(d, UploadTypes.DOCUMENT_EVENT),
      });
    else if (d?.url) out.push(d);
  }
  return out;
};

export const uploadGallery = async images => {
  const out = [];
  for (const i of images) {
    if (isLocalFile(i))
      out.push({
        name: i.name || 'Image',
        url: await uploadFile(i, UploadTypes.GALLERY_EVENT),
      });
    else if (i?.url || i?.uri)
      out.push({ name: i.name || 'Image', url: i.url || i.uri });
  }
  return out;
};
