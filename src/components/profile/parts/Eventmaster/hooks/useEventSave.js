import api from '../../../../../services/api';
import { uploadFile, isLocalFile } from '../uploads/coreUploadUtils';
import {
  uploadDocuments,
  uploadGallery,
  UploadTypes,
} from '../uploads/eventUploadUtils';
import { buildEventUpdatePayload } from '../utils/buildEventPayload';

const deepEqual = (a, b) =>
  JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

export const useEventSave = ({ form, navigation, event_id, originalEvent }) => {
  const save = async () => {
    try {
      if (!event_id) throw new Error('Event ID missing');

      let profileImageUrl = originalEvent?.profile_image ?? null;
      let coverImageUrl = originalEvent?.cover_image ?? null;
      let uploadedDocs = originalEvent?.documents ?? [];
      let uploadedGallery = originalEvent?.gallery_images ?? [];

      /* -----------------------------
         🖼️ PROFILE IMAGE
      ----------------------------- */
      /* -----------------------------
   🖼️ PROFILE IMAGE
----------------------------- */
      if (form.eventImage === null && originalEvent?.profile_image) {
        // ✅ user deleted image
        profileImageUrl = null;
      } else if (
        isLocalFile(form.eventImage) &&
        form.eventImage !== originalEvent?.profile_image
      ) {
        profileImageUrl = await uploadFile(
          form.eventImage,
          UploadTypes.PROFILE_EVENT,
        );
      }

      /* -----------------------------
         🖼️ COVER IMAGE
      ----------------------------- */
      /* -----------------------------
   🖼️ COVER IMAGE
----------------------------- */
      if (form.coverImage === null && originalEvent?.cover_image) {
        // ✅ user deleted image
        coverImageUrl = null;
      } else if (
        isLocalFile(form.coverImage) &&
        form.coverImage !== originalEvent?.cover_image
      ) {
        coverImageUrl = await uploadFile(
          form.coverImage,
          UploadTypes.COVER_EVENT,
        );
      }

      /* -----------------------------
         📎 DOCUMENTS
      ----------------------------- */
      if (!deepEqual(form.documents, originalEvent?.documents)) {
        uploadedDocs = await uploadDocuments(form.documents);
      }

      /* -----------------------------
         🖼️ GALLERY
      ----------------------------- */
      if (!deepEqual(form.galleryImages, originalEvent?.gallery_images)) {
        uploadedGallery = await uploadGallery(form.galleryImages);
      }

      /* -----------------------------
         🧠 BUILD UPDATE PAYLOAD
      ----------------------------- */
      const updates = buildEventUpdatePayload({
        originalEvent,
        form,
        profileImageUrl,
        coverImageUrl,
        uploadedDocs,
        uploadedGallery,
      });

      if (Object.keys(updates).length === 0) {
        navigation.goBack();
        return;
      }

      await api.patch(`/api/events/updateProfile/${event_id}`, updates);
      navigation.goBack();
    } catch (e) {
      console.error('❌ EVENT SAVE FAILED:', e?.response?.data || e.message);
    }
  };

  return { save };
};
