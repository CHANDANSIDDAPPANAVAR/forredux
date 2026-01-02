import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';

const Headerprofile = ({
  title = '',
  openPress,
  isPro,
  backScreen,
  showEdit = true,
}) => {
  const navigation = useNavigation();

  const onBackPress = () => {
    if (backScreen) {
      navigation.replace(backScreen);
    } else {
      navigation.goBack();
    }
  };

  const onEditPress = () => {
    console.log(openPress);
    if (openPress) {
      navigation.navigate(openPress, { isPro });
    }
  };

  return (
    <View style={styles.header}>
      {/* LEFT */}
      <TouchableOpacity
        onPress={onBackPress}
        activeOpacity={0.7}
        hitSlop={HIT_SLOP}
        style={styles.sideBtn}
      >
        <Image
          source={require('../../../../../assets/icons/back-left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* CENTER TITLE */}
      <View style={styles.titleWrap}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      {/* RIGHT (EDIT) */}
      <View style={styles.sideBtn}>
        {showEdit && (
          <TouchableOpacity
            onPress={onEditPress}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(Headerprofile);

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',

    // subtle shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 0.5,
      },
    }),
  },

  sideBtn: {
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    width: 22,
    height: 22,
    tintColor: '#1F2937',
  },

  titleWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 17,
    color: '#111827',
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.2,
  },

  editText: {
    fontSize: 15,
    color: '#2563EB',
    fontFamily: 'Poppins-Medium',
  },
});
