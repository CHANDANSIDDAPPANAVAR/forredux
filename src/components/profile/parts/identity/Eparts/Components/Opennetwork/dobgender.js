import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Keyboard,
} from 'react-native';

const GENDER_OPTIONS = [
  { label: 'Prefer not to say', short: '' },
  { label: 'Male', short: 'M' },
  { label: 'Female', short: 'F' },
  { label: 'Non-binary', short: 'NB' },
  { label: 'Transgender Male', short: 'TM' },
  { label: 'Transgender Female', short: 'TF' },
  { label: 'Intersex', short: 'IS' },
  { label: 'Agender', short: 'AG' },
  { label: 'Genderfluid', short: 'GF' },
  { label: 'Bigender', short: 'BG' },
  { label: 'Demiboy', short: 'DB' },
  { label: 'Demigirl', short: 'DG' },
  { label: 'Two-Spirit', short: '2S' },
  { label: 'Other', short: 'O' },
];

const CURRENT_YEAR = new Date().getFullYear();

const calculateAgeFromYear = year => {
  const y = parseInt(year, 10);
  if (isNaN(y) || y < 1900 || y > CURRENT_YEAR) {
    return '';
  }
  return CURRENT_YEAR - y;
};

const getGenderLabel = short =>
  GENDER_OPTIONS.find(opt => opt.short === short)?.label || '';

export default function GenderDobInput({
  gender,
  setGender,
  birthYear,
  setBirthYear,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const age = useMemo(() => calculateAgeFromYear(birthYear), [birthYear]);

  const handleYearChange = value => {
    if (/^\d{0,4}$/.test(value)) {
      setBirthYear(value);
    }
  };

  const renderGenderItem = ({ item }) => {
    const selected = item.short === gender;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setGender(item.short);
          setModalVisible(false);
        }}
        style={[styles.option, selected && styles.optionSelected]}
      >
        <Text
          style={[styles.optionText, selected && styles.optionTextSelected]}
        >
          {item.label}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.short || 'N/A'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Gender */}
      <Text style={styles.label}>Gender</Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Keyboard.dismiss();
          setModalVisible(true);
        }}
        style={styles.genderInput}
      >
        <Text style={[styles.genderValue, !gender && styles.placeholder]}>
          {gender ? getGenderLabel(gender) : 'Select gender'}
        </Text>
      </TouchableOpacity>

      {/* Birth Year */}
      <View style={styles.yearHeader}>
        <Text style={styles.label}>Birth Year</Text>
        {age !== '' && <Text style={styles.age}>Age: {age}</Text>}
      </View>
      <TextInput
        value={birthYear}
        onChangeText={handleYearChange}
        placeholder="e.g. 1998"
        placeholderTextColor="#9a9a9a"
        keyboardType="number-pad"
        maxLength={4}
        style={styles.yearInput}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                <FlatList
                  data={GENDER_OPTIONS}
                  renderItem={renderGenderItem}
                  keyExtractor={item => item.label}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },

  label: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },

  genderInput: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },

  genderValue: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },

  placeholder: {
    color: '#aaa',
  },

  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    marginHorizontal: 4,
  },

  age: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins-Regular',
  },

  yearInput: {
    marginTop: 6,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#222',
    fontFamily: 'Poppins-Regular',
  },

  overlay: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modal: {
    width: '100%',
    maxHeight: '80%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },

  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },

  optionText: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Poppins-Regular',
  },

  optionTextSelected: {
    color: '#fff',
  },

  badge: {
    backgroundColor: '#000',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
});
