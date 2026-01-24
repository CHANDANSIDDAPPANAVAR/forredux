import { useState } from 'react';

export const useEventForm = () => {
  const [coverImage, setCoverImage] = useState(null);
  const [eventImage, setEventImage] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [category, setCategory] = useState([]); // ✅ ALWAYS ARRAY

  const [eventTypes, setEventTypes] = useState([]);
  const [mode, setMode] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [pickedLocation, setPickedLocation] = useState(null);
  const [pickedAddress, setPickedAddress] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [ticketType, setTicketType] = useState('free');
  const [organizerName, setOrganizerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [altPhoneNumber, setAltPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [pickedPublicLocation, setPickedPublicLocation] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [socialAccounts, setSocialAccounts] = useState({});

  const [customLinks, setCustomLinks] = useState([]);

  return {
    coverImage,
    setCoverImage,
    eventImage,
    setEventImage,
    eventTitle,
    setEventTitle,
    tagline,
    setTagline,
    eventDescription,
    setEventDescription,
    category,
    setCategory,
    eventTypes,
    setEventTypes,
    mode,
    setMode,
    venueName,
    setVenueName,
    pickedLocation,
    setPickedLocation,
    pickedAddress,
    setPickedAddress,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
    ticketType,
    setTicketType,
    organizerName,
    setOrganizerName,
    phoneNumber,
    setPhoneNumber,
    altPhoneNumber,
    setAltPhoneNumber,
    email,
    setEmail,
    visibility,
    setVisibility,
    pickedPublicLocation,
    setPickedPublicLocation,
    keywords,
    setKeywords,
    documents,
    setDocuments,
    galleryImages,
    setGalleryImages,
    socialAccounts,
    setSocialAccounts,
    selectedPlatforms,
    setSelectedPlatforms,
    customLinks,
    setCustomLinks,
  };
};
