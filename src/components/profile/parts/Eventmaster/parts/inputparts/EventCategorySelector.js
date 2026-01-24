import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

/* =====================================================
   GLOBAL EVENT CATEGORIES
===================================================== */
const EVENT_CATEGORIES = [
  'Wedding',
  'Birthday',
  'Engagement',
  'Anniversary',
  'Religious',
  'Cultural',
  'Festival',
  'Concert',
  'Conference',
  'Corporate',
  'Educational',
  'Sports',
  'Community',
  'Charity',
  'Entertainment',
  'Exhibition',
  'Workshop',
  'Online Event',
  'Other',
];

/* =====================================================
   COMPONENT
===================================================== */
const EventCategorySelector = ({ category = [], setCategory }) => {
  const selectedValue = category[0] || '';

  const isPreset = EVENT_CATEGORIES.includes(selectedValue);
  const isCustom = selectedValue && !isPreset;

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  // ✅ Edit mode: backend custom value → tag
  useEffect(() => {
    if (isCustom) {
      setShowCustomInput(false);
      setCustomCategory('');
    }
  }, [isCustom]);

  const handleSelect = item => {
    if (item === 'Other') {
      setShowCustomInput(true);
      setCustomCategory('');
      setCategory([]);
      return;
    }

    setCategory([item]);
    setShowCustomInput(false);
    setCustomCategory('');
  };

  const handleAddCustom = () => {
    const value = customCategory.trim();
    if (!value) return;

    setCategory([value]); // ✅ becomes tag
    setCustomCategory('');
    setShowCustomInput(false);
  };

  const handleRemove = () => {
    setCategory([]);
    setCustomCategory('');
    setShowCustomInput(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Event Category *</Text>

      {/* TAGS */}
      <View style={styles.tagsContainer}>
        {EVENT_CATEGORIES.map(item => {
          const selected =
            selectedValue === item || (item === 'Other' && showCustomInput);

          return (
            <TouchableOpacity
              key={item}
              style={[styles.tag, selected && styles.tagSelected]}
              onPress={() => handleSelect(item)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.tagText, selected && styles.tagTextSelected]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* ✅ CUSTOM TAG WITH REMOVE */}
        {isCustom && (
          <View style={[styles.tag, styles.tagSelected, styles.customTag]}>
            <Text style={styles.tagTextSelected}>{selectedValue}</Text>
            <TouchableOpacity onPress={handleRemove}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* CUSTOM INPUT + ADD BUTTON */}
      {showCustomInput && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter custom category"
            value={customCategory}
            onChangeText={setCustomCategory}
            onSubmitEditing={handleAddCustom}
            returnKeyType="done"
            maxLength={40}
            autoFocus
          />

          <TouchableOpacity style={styles.addBtn} onPress={handleAddCustom}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default EventCategorySelector;

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
    marginBottom: 6,
    fontFamily: 'Poppins-SemiBold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tagSelected: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  customTag: {
    gap: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  tagTextSelected: {
    fontSize: 13,
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    fontFamily: 'Poppins-Regular',
  },
  addBtn: {
    backgroundColor: '#111',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
});
