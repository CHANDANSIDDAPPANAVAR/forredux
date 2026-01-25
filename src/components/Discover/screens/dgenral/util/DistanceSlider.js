import React, { memo, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';

const DistanceSlider = ({ distance, setDistance, onSearch, resetKey }) => {
  const [activated, setActivated] = useState(false);

  // 🔁 Reset when screen refocuses / tab changes
  useEffect(() => {
    setActivated(false);
  }, [resetKey]);

  const readableDistance = useMemo(() => {
    return distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(1)} km`;
  }, [distance]);

  return (
    <View style={[styles.container, !activated && styles.inactiveContainer]}>
      {/* LEFT: Slider */}
      <View style={styles.sliderBox}>
        {activated && <Text style={styles.valueLabel}>{readableDistance}</Text>}

        <Slider
          minimumValue={0.1}
          maximumValue={30}
          step={0.1}
          value={distance}
          onValueChange={() => setActivated(true)}
          onSlidingComplete={setDistance}
          minimumTrackTintColor={activated ? '#5271ff' : '#cfcfcf'}
          maximumTrackTintColor="#e0e0e0"
          thumbTintColor={activated ? '#5271ff' : '#bdbdbd'}
        />
      </View>

      {/* RIGHT: Icon-only Search Button */}
      <TouchableOpacity
        style={[styles.iconButton, !activated && styles.iconButtonDisabled]}
        onPress={onSearch}
        disabled={!activated}
        activeOpacity={0.85}
      >
        <Image
          source={require('../../../../assets/util/filtserch.png')} // 👈 your local icon
          style={[styles.searchIcon, !activated && styles.searchIconDisabled]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(DistanceSlider);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 6,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#fff',

    // Android
    elevation: 2,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },

    borderWidth: 1,
    borderColor: '#efefef',
  },

  inactiveContainer: {
    opacity: 0.55,
  },

  sliderBox: {
    flex: 1,
    marginRight: 10,
  },

  valueLabel: {
    fontSize: 11,
    fontWeight: Platform.OS === 'android' ? '600' : '700',
    color: '#5271ff',
    textAlign: 'center',
    marginBottom: 4,
  },

  inactiveText: {
    color: '#9e9e9e',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#5271ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconButtonDisabled: {
    backgroundColor: '#bdbdbd',
  },

  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },

  searchIconDisabled: {
    tintColor: '#f5f5f5',
  },
});
