import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAndroidBackHandler from '../navigation/util/useBackToHome';

const Blink = () => {
  const navigation = useNavigation();

  // 🤖 Android hardware back
  useAndroidBackHandler(() => {
    navigation.navigate('HomeTab');
  });

  return (
    <View style={styles.container}>
      {/* 🍎 iOS BACK BUTTON */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('HomeTab')}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Blink</Text>
    </View>
  );
};

export default Blink;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // typical Blink / camera background
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50, // adjust if needed for SafeArea
    left: 16,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
});
