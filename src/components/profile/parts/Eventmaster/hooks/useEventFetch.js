import { useEffect, useRef, useState } from 'react';
import api from '../../../../../services/api';

export const useEventFetch = (event_id, form) => {
  const [loading, setLoading] = useState(false);
  const [originalEvent, setOriginalEvent] = useState(null);
  const hydratedRef = useRef(false); // 🔒 LOCK

  useEffect(() => {
    if (!event_id || hydratedRef.current) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);

        const cleanedId = event_id.trim().toLowerCase().replace(/\s+/g, '');
        const res = await api.get(`/api/events/${cleanedId}`);
        const event = res.data?.event;
        console.log(event);
        if (!event) return;

        hydratedRef.current = true; // 🔒 lock after first fill
        setOriginalEvent(event);

        form.setEventTitle(event.name || '');
        form.setTagline(event.tagline || '');
        form.setEventDescription(event.description || '');

        form.setCategory(event.category || []);
        form.setEventTypes(event.type || []);

        form.setMode(event.mode || null);
        form.setVenueName(event.venue_name || '');
        form.setPickedAddress(event.address || '');

        form.setPickedLocation(
          event.latitude && event.longitude
            ? { latitude: event.latitude, longitude: event.longitude }
            : null,
        );

        form.setPickedPublicLocation(
          event.public_latitude && event.public_longitude
            ? {
                latitude: event.public_latitude,
                longitude: event.public_longitude,
              }
            : null,
        );

        form.setStartDateTime(
          event.start_datetime ? new Date(event.start_datetime) : null,
        );
        form.setEndDateTime(
          event.end_datetime ? new Date(event.end_datetime) : null,
        );

        form.setTicketType(event.ticket_type || 'free');
        form.setOrganizerName(event.organizer_name || '');
        form.setPhoneNumber(event.phone_number || '');
        form.setAltPhoneNumber(event.alt_phone_number || '');
        form.setEmail(event.email || '');

        form.setVisibility(event.visibility || 'public');
        form.setKeywords(event.keywords || []);
        const links =
          event.social_links && typeof event.social_links === 'object'
            ? event.social_links
            : {};

        form.setSocialAccounts(links);
        form.setSelectedPlatforms(Object.keys(links));

        form.setCustomLinks(event.custom_links || []);

        form.setDocuments(event.documents || []);
        form.setGalleryImages(event.gallery_images || []);
        form.setEventImage(event.profile_image || null);
        form.setCoverImage(event.cover_image || null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [event_id]);

  return { loading, originalEvent };
};
