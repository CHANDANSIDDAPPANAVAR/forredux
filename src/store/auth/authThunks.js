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
    creatorCreated,
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
        creatorCreated,
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
          creatorCreated,
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

//svae accounttype

export const syncAccountTypeThunk = () => async (dispatch, getState) => {
  const { accessToken, userAccountType, userSubscription } = getState().auth;

  if (!accessToken) return;

  try {
    const res = await api.get('/api/subscription', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.data?.success) return;

    const backendAccountType = res.data.accounttype || null;
    const backendSubscription = res.data.subscription || 'free';

    let changed = false;
    const updates = {};

    if (backendAccountType && backendAccountType !== userAccountType) {
      updates.userAccountType = backendAccountType;
      changed = true;
    }

    if (backendSubscription && backendSubscription !== userSubscription) {
      updates.userSubscription = backendSubscription;
      changed = true;
    }

    if (!changed) return;

    // ✅ update redux
    dispatch(authSuccess(updates));

    // ✅ persist to keychain
    await saveTokens({
      ...getState().auth,
      ...updates,
    });
  } catch (err) {
    console.warn(
      'syncAccountTypeThunk error:',
      err?.response?.data || err.message,
    );
  }
};

export const saveAccountTypeThunk =
  accountType => async (dispatch, getState) => {
    const { accessToken } = getState().auth;
    if (!accessToken) throw new Error('No access token');

    try {
      const res = await api.post(
        '/api/saveAccountType',
        { accountType },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      dispatch(
        authSuccess({
          userAccountType: res.data.accountType || accountType,
        }),
      );

      await saveTokens({
        ...getState().auth,
        userAccountType: res.data.accountType || accountType,
      });

      return true;
    } catch (err) {
      // ✅ Multi-device already selected
      if (err.response?.status === 409) {
        const backendType = err.response.data.accountType;

        dispatch(
          authSuccess({
            userAccountType: backendType,
          }),
        );

        await saveTokens({
          ...getState().auth,
          userAccountType: backendType,
        });

        return true;
      }

      throw err;
    }
  };

export const setCreatorCreatedThunk = () => async (dispatch, getState) => {
  const { accessToken, creatorCreated } = getState().auth;

  // ⛔ Already set locally → skip API
  if (creatorCreated) {
    return true;
  }

  if (!accessToken) {
    throw new Error('No access token');
  }

  try {
    // 🔍 Check if creator exists
    console.log('i get cakl');
    const res = await api.get('/api/creators/exists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res?.data?.exists) {
      // ✅ Creator already exists
      dispatch(
        authSuccess({
          creatorCreated: true,
        }),
      );

      await saveTokens({
        ...getState().auth,
        creatorCreated: true,
      });

      return true;
    }
  } catch (err) {
    // 404 means creator does NOT exist → allow creation
    if (err.response?.status !== 404) {
      throw err;
    }
  }

  return false;
};

export const saveCreatorCreatedThunk = () => async (dispatch, getState) => {
  const { accessToken, creatorCreated } = getState().auth;

  if (!accessToken) {
    throw new Error('No access token');
  }

  // ⛔ already set → do nothing
  if (creatorCreated) {
    return true;
  }

  // ✅ update redux
  dispatch(
    authSuccess({
      creatorCreated: true,
    }),
  );

  // ✅ persist in storage
  await saveTokens({
    ...getState().auth,
    creatorCreated: true,
  });

  return true;
};
