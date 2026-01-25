import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const SearchHeader = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  onBack,
  showBack,
  placeholder = 'Search',
}) => {
  const canSearch = value?.trim().length > 0;

  return (
    <View style={styles.container}>
      {showBack && (
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={10}
        >
          <Image
            source={require('../../../assets/icons/back-left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      )}

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          onChangeText={onChangeText}
          returnKeyType="search"
          onSubmitEditing={canSearch ? onSubmit : undefined}
        />

        {/* RIGHT ACTIONS */}
        {canSearch ? (
          <>
            {/* CLEAR */}
            <TouchableOpacity
              onPress={onClear}
              hitSlop={10}
              style={styles.iconBtn}
            >
              <Text style={styles.clear}>✕</Text>
            </TouchableOpacity>

            {/* SEARCH ICON */}
            <TouchableOpacity
              onPress={onSubmit}
              hitSlop={10}
              style={styles.iconBtn}
            >
              <Image
                source={require('../../../assets/util/filtserch.png')}
                style={styles.searchIconActive}
              />
            </TouchableOpacity>
          </>
        ) : (
          <Image
            source={require('../../../assets/util/filtserch.png')}
            style={styles.searchIcon}
          />
        )}
      </View>
    </View>
  );
};

export default React.memo(SearchHeader);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },

  backButton: {
    marginRight: 8,
    padding: 6,
  },

  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#111827',
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    paddingLeft: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 0,
  },

  iconBtn: {
    paddingHorizontal: 8,
    height: '100%',
    justifyContent: 'center',
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#9ca3af',
    marginRight: 12,
  },

  searchIconActive: {
    width: 18,
    height: 18,
    tintColor: '#5271ff',
  },

  clear: {
    fontSize: 16,
    color: '#6b7280',
  },
});
