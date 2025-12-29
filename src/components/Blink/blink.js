import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { loadTokens } from '../../store/auth/authStorage';
import { useDispatch } from 'react-redux';
import { loginThunk, logoutThunk } from '../../store/auth/authThunks';

const Blink = () => {
  const auth = useSelector(state => state.auth);
  console.log('AUTH STATE:', auth);
  useEffect(() => {
    loadTokens().then(data => {
      console.log('KEYCHAIN TOKENS:', data);
    });
  }, []);
  const dispatch = useDispatch();

  // fake login
  dispatch(
    loginThunk({
      accessToken: 'test-access',
      refreshToken: 'test-refresh',
      sessionId: 'test-session',
      userAccountType: 'user',
      userSubscription: 'free',
      userId: 1,
      userCountry: 'IN',
      userShownearby: true,
    }),
  );

  // fake logout
  dispatch(logoutThunk());
  return (
    <View>
      <Text>Blink</Text>
    </View>
  );
};

export default Blink;
