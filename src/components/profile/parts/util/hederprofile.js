import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

const HEADER_BG = '#f6f7f9';

const HeadreProf = ({ title, backScreen }) => {
  const navigation = useNavigation();

  const onBackPress = () => {
    if (backScreen) {
      navigation.reset({
        index: 0,
        routes: [{ name: backScreen }],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      {/* STATUS BAR */}
      <StatusBar backgroundColor={HEADER_BG} barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../../assets/icons/back-left.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        {/* Spacer to keep title centered */}
        <View style={styles.rightSpace} />
      </View>
    </>
  );
};

export default HeadreProf;

const styles = StyleSheet.create({
  header: {
    backgroundColor: HEADER_BG,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 6,
  },
  backIcon: {
    width: 22,
    height: 22,
    tintColor: 'rgba(46, 43, 43, 0.85)',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  rightSpace: {
    width: 34,
  },
});
