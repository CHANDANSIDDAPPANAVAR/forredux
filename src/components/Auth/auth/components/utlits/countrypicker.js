import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import countries from './countries';

const {width, height} = Dimensions.get('window');

const CountryPickerModal = ({visible, onClose, onSelect}) => {
  const [searchText, setSearchText] = useState('');

  const filteredCountries = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    return countries.filter(country =>
      country.label.toLowerCase().includes(lowerSearch),
    );
  }, [searchText]);

  const handleClose = useCallback(() => {
    setSearchText('');
    onClose();
  }, [onClose]);

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={styles.countryOption}
        onPress={() => {
          onSelect(item);
          handleClose();
        }}>
        <View style={styles.countryPicker}>
          <View style={styles.countryFlagsMode}>
            <Image source={item.image} style={styles.countryFlag} />
          </View>
          <Text style={styles.countryOptionText}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    ),
    [handleClose, onSelect],
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.countryLabel}>Select Your Country</Text>
            <TextInput
              placeholder="Search country..."
              value={searchText}
              placeholderTextColor={'rgba(161, 155, 155, 1)'}
              onChangeText={setSearchText}
              style={styles.searchInput}
            />
            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.value}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.81)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: width * 0.85,
    maxHeight: height * 0.5,
    paddingVertical: 15,
    elevation: 5,
  },
  countryLabel: {
    textAlign: 'center',
    padding: 5,
    color: '#6A11CB',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
  countryOption: {
    paddingVertical: 1,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryFlagsMode: {
    backgroundColor: '#f5f5f5',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  countryOptionText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  countryFlag: {
    resizeMode: 'contain',
    height: 26,
    width: 26,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});

export default CountryPickerModal;
