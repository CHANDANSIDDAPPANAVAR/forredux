import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchAndCacheProfile } from '../profilestore/Fechprofiledata';
import { useSelector } from 'react-redux';

const Opennetwork = () => {
  const { accessToken } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const loadProfile = async () => {
      try {
        const data = await fetchAndCacheProfile(accessToken);
        setProfile(data);
        console.log(data);
      } catch (err) {
        console.error('❌ Failed to load profile:', err);
      }
    };

    loadProfile();
  }, [accessToken]);

  return (
    <SafeAreaView>
      <Text>Opennetwork</Text>

      {profile && (
        <View>
          <Text>{profile.name}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Opennetwork;
