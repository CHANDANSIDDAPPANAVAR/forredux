import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStart, authSuccess, authLogout } from './authSlice';
import { saveTokens, clearTokens } from './authStorage';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../../navigation/NavigationService';
import api from '../../services/api';
/* =====================================
   LOGIN THUNK
===================================== */
export const loginThunk =
  ({
    accessToken,
    refreshToken,
    sessionId,
    userAccountType,
    userSubscription,
    userId,
    userCountry,
    userShownearby,
  }) =>
  async dispatch => {
    dispatch(authStart());

    try {
      // clear old data
      await AsyncStorage.clear();
      await clearTokens();

      // save to keychain
      const saved = await saveTokens({
        accessToken,
        refreshToken,
        sessionId,
        userAccountType,
        userSubscription,
        userId,
        userCountry,
        userShownearby,
      });

      if (!saved) {
        throw new Error('Token save failed');
      }

      // update redux
      dispatch(
        authSuccess({
          accessToken,
          refreshToken,
          sessionId,
          userAccountType,
          userSubscription,
          userId,
          userCountry,
          userShownearby,
        }),
      );

      // navigate
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'App' }],
        }),
      );
    } catch (err) {
      console.error('LOGIN THUNK ERROR:', err.message);
      dispatch(authLogout());
      throw err;
    }
  };

/* =====================================
   LOGOUT THUNK (LOCAL)
===================================== */
export const logoutThunk = () => async dispatch => {
  try {
    await AsyncStorage.clear();
    await clearTokens();
  } catch (err) {
    console.warn('LOGOUT CLEANUP ERROR:', err.message);
  } finally {
    dispatch(authLogout());

    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );
  }
};

/* =====================================
   LOGOUT CURRENT DEVICE
===================================== */
export const currentLogoutThunk = () => async (dispatch, getState) => {
  const { accessToken, sessionId } = getState().auth;

  try {
    if (accessToken && sessionId) {
      await api.post(
        `/api/singlesessions/${sessionId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    }
  } catch {
    // ignore backend failure
  } finally {
    await AsyncStorage.clear();
    await clearTokens();
    dispatch(authLogout());

    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );
  }
};

/* =====================================
   LOGOUT ALL DEVICES
===================================== */
export const logoutAllThunk = () => async (dispatch, getState) => {
  console.log('🟢 logoutAllThunk called');

  const { accessToken } = getState().auth;
  console.log('🟢 accessToken exists:', !!accessToken);

  try {
    if (accessToken) {
      console.log('🟡 Calling logout API...');
      await api.post(
        '/api/logout',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      console.log('✅ Logout API success');
    } else {
      console.log('❌ No accessToken, API not called');
    }
  } catch (err) {
    console.log('❌ Logout API error:', err?.message);
    console.log('❌ error.response:', err?.response);
  } finally {
    console.log('🔵 Running local logout cleanup');

    await AsyncStorage.clear();
    await clearTokens();
    dispatch(authLogout());

    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      }),
    );

    console.log('🔴 Navigation reset to Auth');
  }
};

export const refreshTokenThunk = () => async (dispatch, getState) => {
  const { refreshToken, sessionId, isAuthenticated } = getState().auth;

  // 🔒 Already logged out → do nothing
  if (!isAuthenticated || !refreshToken || !sessionId) {
    dispatch(authLogout());
    return null; // ✅ NO rejection
  }

  try {
    const res = await api.post('/api/refresh', {
      refreshToken,
      sessionId,
    });

    const { accessToken, refreshToken: newRefresh } = res.data;

    const updated = {
      ...getState().auth,
      accessToken,
      refreshToken: newRefresh || refreshToken,
    };

    await saveTokens(updated);

    dispatch(
      authSuccess({
        accessToken: updated.accessToken,
        refreshToken: updated.refreshToken,
      }),
    );

    return accessToken;
  } catch {
    dispatch(authLogout());
    return null; // ✅ NO rejection
  }
};
