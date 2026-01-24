import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  Pressable,
} from 'react-native';

/* =====================================================
   GLOBAL EVENT TYPES
===================================================== */
const EVENT_TYPES = [
  'Ceremony',
  'Celebration',
  'Party',
  'Meetup',
  'Seminar',
  'Workshop',
  'Conference',
  'Webinar',
  'Training',
  'Festival',
  'Concert',
  'Exhibition',
  'Competition',
  'Hackathon',
  'Networking',
  'Panel Discussion',
  'Product Launch',
  'Fundraiser',
  'Award Ceremony',
  'Performance',
  'Retreat',
  'Open House',
  'Virtual Session',
];

/* =====================================================
   HELPERS
===================================================== */
const normalize = text =>
  text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

/* =====================================================
   COMPONENT
===================================================== */
const EventTypeSelector = ({ selectedTypes = [], setSelectedTypes }) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const canAddMore = selectedTypes.length < 3;

  const filtered = useMemo(() => {
    if (!open) return [];
    const term = search.toLowerCase();
    return EVENT_TYPES.filter(
      t => t.toLowerCase().includes(term) && !selectedTypes.includes(t),
    );
  }, [search, selectedTypes, open]);

  const closeDropdown = () => {
    setOpen(false);
    setSearch('');
    Keyboard.dismiss();
  };

  const addType = value => {
    if (!canAddMore) return;

    const normalized = normalize(value);
    if (!normalized || selectedTypes.includes(normalized)) {
      closeDropdown();
      return;
    }

    setSelectedTypes([...selectedTypes, normalized]);
    closeDropdown();
  };

  const removeType = type => {
    setSelectedTypes(selectedTypes.filter(t => t !== type));
  };

  const showCustom =
    search.length > 1 &&
    !EVENT_TYPES.some(t => t.toLowerCase() === search.toLowerCase());

  return (
    <Pressable onPress={closeDropdown}>
      <View style={styles.container}>
        <Text style={styles.label}>Event Type (Optional)</Text>
        <Text style={styles.helper}>Select or add up to 3 event formats</Text>

        {/* Selected tags */}
        <View style={styles.tagsContainer}>
          {selectedTypes.map(type => (
            <View key={type} style={styles.tagSelected}>
              <Text style={styles.tagText}>{type}</Text>
              <TouchableOpacity onPress={() => removeType(type)}>
                <Text style={styles.removeText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Input */}
        {canAddMore && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Search or add event type"
              placeholderTextColor="#999"
              value={search}
              onFocus={() => setOpen(true)}
              onChangeText={setSearch}
              onSubmitEditing={() => addType(search)}
              returnKeyType="done"
            />

            {/* Dropdown */}
            {open && (filtered.length > 0 || showCustom) && (
              <View style={styles.dropdown}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {filtered.map(item => (
                    <TouchableOpacity
                      key={item}
                      style={styles.dropdownItem}
                      onPress={() => addType(item)}
                    >
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  ))}

                  {showCustom && (
                    <TouchableOpacity
                      style={[styles.dropdownItem, styles.customItem]}
                      onPress={() => addType(search)}
                    >
                      <Text style={styles.customText}>
                        Add “{normalize(search)}”
                      </Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
};

export default EventTypeSelector;

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    color: '#111',
    marginLeft: 4,
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  helper: {
    fontSize: 12,
    color: '#777',
    marginLeft: 4,
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'Poppins-Regular',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
  removeText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  dropdown: {
    marginTop: 6,
    maxHeight: 180,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customItem: {
    backgroundColor: '#f9fafb',
  },
  customText: {
    fontStyle: 'italic',
    color: '#333',
  },
});
