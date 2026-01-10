import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

/* ----------------------------------
   Layout config (MATCH VIEW GRID)
----------------------------------- */
const numColumns = 4;
const screenWidth = Dimensions.get('window').width;
const spacing = 20;
const totalSpacing = spacing * (numColumns + 1);
const gridItemSize = (screenWidth - totalSpacing) / numColumns;

/* ----------------------------------
   Platforms
----------------------------------- */
const socialPlatforms = [
  {
    key: 'website',
    label: 'Website',
    icon: require('../../../../../../assets/aproficons/webp.png'),
    placeholder: 'https://example.com',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    icon: require('../../../../../../assets/aproficons/fbforp.png'),
    placeholder: 'Facebook profile',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    icon: require('../../../../../../assets/aproficons/instagram.png'),
    placeholder: '@username',
  },
  {
    key: 'X',
    label: 'X',
    icon: require('../../../../../../assets/aproficons/twitterp.png'),
    placeholder: '@username',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: require('../../../../../../assets/aproficons/whatsappp.png'),
    placeholder: 'Phone or link',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    icon: require('../../../../../../assets/aproficons/youtubep.png'),
    placeholder: 'Channel link',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    icon: require('../../../../../../assets/aproficons/telegramp.png'),
    placeholder: '@username',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: require('../../../../../../assets/aproficons/inkedinp.png'),
    placeholder: 'Profile URL',
  },
  {
    key: 'pinterest',
    label: 'Pinterest',
    icon: require('../../../../../../assets/aproficons/pinterestp.png'),
    placeholder: '@username',
  },
];

/* ----------------------------------
   Component
----------------------------------- */
const SocialMediaInputs = ({
  socialAccounts,
  setSocialAccounts,
  selectedPlatforms,
  setSelectedPlatforms,
}) => {
  /* Add platform */
  const addPlatform = key => {
    if (!selectedPlatforms.includes(key)) {
      setSelectedPlatforms(prev => [...prev, key]);
    }
  };

  /* Remove platform */
  const removePlatform = key => {
    setSelectedPlatforms(prev => prev.filter(p => p !== key));
    setSocialAccounts(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  /* Update value */
  const updateValue = (key, value) => {
    setSocialAccounts(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Social links</Text>

      {/* ICON GRID (same as view grid) */}
      <View style={styles.grid}>
        {socialPlatforms.map(p => {
          const active = selectedPlatforms.includes(p.key);

          return (
            <TouchableOpacity
              key={p.key}
              onPress={() => addPlatform(p.key)}
              activeOpacity={0.85}
              style={[styles.gridItem, active && styles.activeItem]}
            >
              <Image source={p.icon} style={styles.icon} />
              <Text style={styles.label}>{p.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* INPUTS */}
      {selectedPlatforms.map(key => {
        const platform = socialPlatforms.find(p => p.key === key);
        if (!platform) return null;

        return (
          <View key={key} style={styles.inputRow}>
            <Image source={platform.icon} style={styles.inputIcon} />

            <TextInput
              style={styles.input}
              placeholder={platform.placeholder}
              value={socialAccounts[key] || ''}
              onChangeText={text => updateValue(key, text)}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity onPress={() => removePlatform(key)}>
              <Text style={styles.remove}>×</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default SocialMediaInputs;

/* ----------------------------------
   Styles (MATCH VIEW GRID)
----------------------------------- */
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    marginLeft: 8,
    fontFamily: 'Poppins-SemiBold',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },

  gridItem: {
    width: gridItemSize,
    height: gridItemSize,
    margin: 6,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },

  activeItem: {
    borderWidth: 2,
    borderColor: '#2563eb',
    backgroundColor: '#eef2ff',
  },

  icon: {
    width: gridItemSize * 0.36,
    height: gridItemSize * 0.36,
    resizeMode: 'contain',
    marginBottom: 4,
  },

  label: {
    fontSize: 10,
    color: '#555',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  inputIcon: {
    width: 22,
    height: 22,
    marginLeft: 10,
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#111',
  },

  remove: {
    fontSize: 22,
    paddingHorizontal: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
});
