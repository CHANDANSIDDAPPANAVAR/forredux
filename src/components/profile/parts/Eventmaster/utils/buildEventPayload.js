const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const normalizeArray = v => (Array.isArray(v) ? v : []);
const normalizeValue = v => (v === undefined ? null : v);

export const buildEventUpdatePayload = ({
  originalEvent,
  form,
  profileImageUrl,
  coverImageUrl,
  uploadedDocs,
  uploadedGallery,
}) => {
  const updates = {};

  const payload = {
    // 🔤 TEXT
    name: form.eventTitle?.trim() || null,
    tagline: form.tagline?.trim() || null,
    description: form.eventDescription?.trim() || null,

    // 📚 ARRAYS (Postgres text[])
    category: normalizeArray(form.category),
    type: normalizeArray(form.eventTypes),
    keywords: normalizeArray(form.keywords),

    // 📍 LOCATION
    mode: form.mode,
    venue_name: form.venueName || null,
    address: form.pickedAddress || null,
    latitude: form.pickedLocation?.latitude ?? null,
    longitude: form.pickedLocation?.longitude ?? null,

    // 🌍 VISIBILITY
    visibility: form.visibility,
    public_latitude: form.pickedPublicLocation?.latitude ?? null,
    public_longitude: form.pickedPublicLocation?.longitude ?? null,

    // ⏱️ TIME
    start_datetime: form.startDateTime,
    end_datetime: form.endDateTime,

    // 🎫 OTHER
    ticket_type: form.ticketType,
    organizer_name: form.organizerName || null,
    phone_number: form.phoneNumber || null,
    alt_phone_number: form.altPhoneNumber || null,
    email: form.email || null,

    // 🧩 JSONB
    social_links: form.socialAccounts || {},
    custom_links: normalizeArray(form.customLinks),

    // 📎 FILES (JSONB)
    documents: uploadedDocs,
    gallery_images: uploadedGallery,

    // 🖼️ IMAGES
    profile_image: profileImageUrl,
    cover_image: coverImageUrl,
  };

  for (const key in payload) {
    const current = normalizeValue(payload[key]);
    const original = normalizeValue(originalEvent?.[key]);

    if (!deepEqual(current, original)) {
      updates[key] = payload[key];
    }
  }

  return updates;
};
