import { authStart, authSuccess, authFinish } from './authSlice';
import { loadTokens } from './authStorage';

export const bootstrapAuth = () => async dispatch => {
  dispatch(authStart());

  try {
    const stored = await loadTokens();

    if (!stored) {
      dispatch(authFinish()); // 🔑 stop loading
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
    dispatch(authFinish());
  }
};
