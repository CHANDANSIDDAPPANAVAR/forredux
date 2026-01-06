import React, { memo, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  Platform,
} from 'react-native';

/* ----------------------------------
   Social Platform Config
----------------------------------- */
const socialPlatforms = {
  website: {
    label: 'Website',
    icon: require('../../../../../assets/aproficons/webp.png'),
    getUrl: url => (/^https?:\/\//i.test(url) ? url : `https://${url}`),
  },

  facebook: {
    label: 'Facebook',
    icon: require('../../../../../assets/aproficons/fbforp.png'),
    appUrl: username =>
      `fb://facewebmodal/f?href=https://facebook.com/${username}`,
    webUrl: username => `https://facebook.com/${username}`,
  },

  instagram: {
    label: 'Instagram',
    icon: require('../../../../../assets/aproficons/instagram.png'),
    appUrl: username => `instagram://user?username=${username}`,
    webUrl: username => `https://instagram.com/${username}`,
  },

  X: {
    label: 'X',
    icon: require('../../../../../assets/aproficons/twitterp.png'),
    webUrl: username => `https://twitter.com/${username}`,
  },

  whatsapp: {
    label: 'WhatsApp',
    icon: require('../../../../../assets/aproficons/whatsappp.png'),
    validate: number => /^[0-9]{10,}$/.test(number.replace(/[^0-9]/g, '')),
    appUrl: number => `whatsapp://send?phone=${number.replace(/[^0-9]/g, '')}`,
    webUrl: number => `https://wa.me/${number.replace(/[^0-9]/g, '')}`,
  },

  youtube: {
    label: 'YouTube',
    icon: require('../../../../../assets/aproficons/youtubep.png'),
    webUrl: channel => `https://youtube.com/${channel}`,
  },

  tiktok: {
    label: 'TikTok',
    icon: require('../../../../../assets/aproficons/tiktokp.png'),
    webUrl: username => `https://www.tiktok.com/@${username}`,
  },

  telegram: {
    label: 'Telegram',
    icon: require('../../../../../assets/aproficons/telegramp.png'),
    appUrl: username => `tg://resolve?domain=${username.replace(/^@/, '')}`,
    webUrl: username => `https://t.me/${username.replace(/^@/, '')}`,
  },

  linkedin: {
    label: 'LinkedIn',
    icon: require('../../../../../assets/aproficons/inkedinp.png'),
    getUrl: url => (/^https?:\/\//i.test(url) ? url : `https://${url}`),
  },

  pinterest: {
    label: 'Pinterest',
    icon: require('../../../../../assets/aproficons/pinterestp.png'),
    webUrl: username => `https://www.pinterest.com/${username}`,
  },
};

/* ----------------------------------
   Helpers
----------------------------------- */
const normalizeAccounts = data =>
  data && typeof data === 'object' && !Array.isArray(data) ? data : {};

/* ----------------------------------
   Component
----------------------------------- */
const SocialLinksGrid = ({ socialAccounts }) => {
  const safeAccounts = normalizeAccounts(socialAccounts);

  const validItems = useMemo(() => {
    return Object.keys(socialPlatforms).filter(key => {
      const value = safeAccounts[key];
      const platform = socialPlatforms[key];

      if (typeof value !== 'string') return false;
      if (value.trim() === '') return false;
      if (platform.validate && !platform.validate(value)) return false;

      return true;
    });
  }, [safeAccounts]);

  const openLink = useCallback(async (platformKey, value) => {
    const platform = socialPlatforms[platformKey];

    try {
      let appUrl;
      let webUrl;

      if (platform.getUrl) {
        webUrl = platform.getUrl(value);
      } else {
        appUrl = platform.appUrl?.(value);
        webUrl = platform.webUrl?.(value);
      }

      if (appUrl && (await Linking.canOpenURL(appUrl))) {
        await Linking.openURL(appUrl);
      } else if (webUrl) {
        await Linking.openURL(webUrl);
      } else {
        throw new Error('Invalid URL');
      }
    } catch {
      Alert.alert('Unable to open link', platform.label);
    }
  }, []);

  /* ❌ Render nothing if no valid links */
  if (validItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.grid}>
      {validItems.map(key => (
        <TouchableOpacity
          key={key}
          style={styles.gridItem}
          activeOpacity={0.85}
          onPress={() => openLink(key, safeAccounts[key])}
          accessibilityLabel={`Open ${socialPlatforms[key].label}`}
        >
          <Image source={socialPlatforms[key].icon} style={styles.icon} />
          <Text style={styles.label}>{socialPlatforms[key].label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(SocialLinksGrid);

/* ----------------------------------
   Layout & Styles
----------------------------------- */
const numColumns = 4;
const screenWidth = Dimensions.get('window').width;
const spacing = 20;
const totalSpacing = spacing * (numColumns + 1);
const gridItemSize = (screenWidth - totalSpacing) / numColumns;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  gridItem: {
    width: gridItemSize,
    height: gridItemSize,
    margin: 6,
    borderRadius: 10,
    backgroundColor: '#ffffff',
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
});
