import api from '../../services/api';
import { authSuccess, authLogout } from './authSlice';
import { loadTokens, clearTokens, saveTokens } from './authStorage';
import { isTokenExpired } from './tokenUtils';

export const validateAuthThunk = () => async dispatch => {
  const stored = await loadTokens();

  if (!stored) {
    dispatch(authLogout()); // loading=false
    return;
  }

  let { accessToken, refreshToken, sessionId } = stored;

  if (isTokenExpired(refreshToken)) {
    await clearTokens();
    dispatch(authLogout());
    return;
  }

  if (isTokenExpired(accessToken)) {
    try {
      const res = await api.post('/api/refresh', {
        refreshToken,
        sessionId,
      });

      accessToken = res.data.accessToken;
      refreshToken = res.data.refreshToken || refreshToken;

      await saveTokens({
        ...stored,
        accessToken,
        refreshToken,
      });
    } catch {
      await clearTokens();
      dispatch(authLogout());
      return;
    }
  }

  try {
    const res = await api.get('/api/check-session', {
      params: { sessionId },
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.data?.isSessionValid) {
      await clearTokens();
      dispatch(authLogout());
      return;
    }
  } catch {
    // offline → allow
  }

  dispatch(
    authSuccess({
      accessToken,
      refreshToken,
      sessionId,
    }),
  );
};
