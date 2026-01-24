export const useEventValidation = form => {
  if (!form.eventTitle?.trim()) {
    return { valid: false, message: 'Event title is required' };
  }

  if (!form.mode) {
    return { valid: false, message: 'Event mode is required' };
  }

  if (form.mode === 'Offline' && !form.pickedLocation) {
    return {
      valid: false,
      message: 'Location is required for offline events',
    };
  }

  if (
    form.startDateTime &&
    form.endDateTime &&
    form.endDateTime < form.startDateTime
  ) {
    return {
      valid: false,
      message: 'End date must be after start date',
    };
  }

  return { valid: true };
};
