import { authStart, authSuccess, authLogout } from './authSlice';
import { loadTokens } from './authStorage';

/* =====================================
   BOOTSTRAP AUTH (APP START)
===================================== */
export const bootstrapAuth = () => async dispatch => {
  dispatch(authStart());

  try {
    const stored = await loadTokens();

    if (!stored || !stored.accessToken || !stored.sessionId) {
      // no valid session stored
      dispatch(authLogout());
      return;
    }

    dispatch(
      authSuccess({
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
        sessionId: stored.sessionId,
        userAccountType: stored.userAccountType,
        userSubscription: stored.userSubscription,
        userId: stored.userId,
        userCountry: stored.userCountry,
        userShownearby: stored.userShownearby,
      }),
    );
  } catch (err) {
    console.error('BOOTSTRAP AUTH ERROR:', err.message);
    dispatch(authLogout());
  }
};
