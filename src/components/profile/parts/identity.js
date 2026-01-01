import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { syncAccountTypeThunk } from '../../../store/auth/authThunks';
import Business from './identity/screens/Business';
import Professionals from './identity/screens/Professionals';
import Service from './identity/screens/Service';
import Opennetwork from './identity/screens/Opennetwork';

export default function Identity() {
  const dispatch = useDispatch();

  const { userAccountType, userSubscription } = useSelector(
    state => state.auth,
  );

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const sync = async () => {
        try {
          await dispatch(syncAccountTypeThunk());
        } finally {
          setLoading(false);
        }
      };

      sync();
    }, [dispatch]),
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!userAccountType) {
    return <Text style={styles.warning}>Account type not found.</Text>;
  }
  console.log('accoynt and usertype ', userSubscription, userAccountType);
  const isPro = userSubscription === 'premium';
  const accountType = userAccountType.toUpperCase();

  switch (accountType) {
    case 'BUSINESS':
      return <Business isPro={isPro} />;
    case 'PROFESSIONALS':
      return <Professionals isPro={isPro} />;
    case 'SERVICE':
      return <Service isPro={isPro} />;
    case 'OPEN_NETWORK':
      return <Opennetwork isPro={isPro} />;
    default:
      return (
        <Text style={styles.warning}>Unknown account type: {accountType}</Text>
      );
  }
}

const styles = StyleSheet.create({
  warning: {
    fontSize: 16,
    color: 'red',
    padding: 16,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
