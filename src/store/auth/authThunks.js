import AsyncStorage from '@react-native-async-storage/async-storage';
import { authStart, authSuccess, authLogout } from './authSlice';
import { saveTokens, clearTokens } from './authStorage';
import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '../../navigation/NavigationService';

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
  const { accessToken } = getState().auth;

  try {
    if (accessToken) {
      await api.post(
        '/api/logout',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
    }
  } catch {
    // ignore
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

export const refreshTokenThunk = () => async (dispatch, getState) => {
  const { refreshToken, sessionId } = getState().auth;

  if (!refreshToken || !sessionId) {
    throw new Error('No refresh token');
  }

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

  return accessToken; // IMPORTANT
};
