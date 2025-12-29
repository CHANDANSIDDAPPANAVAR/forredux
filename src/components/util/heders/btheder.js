import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles/btstyles';

export default function ScreenHeader({ title, onBack }) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* BACK */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={handleBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      {/* TITLE */}
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>

      {/* RIGHT PLACEHOLDER */}
      <View style={styles.rightSpace} />
    </View>
  );
}
