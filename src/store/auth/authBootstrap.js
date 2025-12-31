import { authStart, authSuccess, authFinish } from './authSlice';
import { loadTokens } from './authStorage';

export const bootstrapAuth = () => async dispatch => {
  console.log('🔵 [BOOTSTRAP] started');

  dispatch(authStart());

  try {
    const stored = await loadTokens();

    console.log('🟡 [BOOTSTRAP] raw keychain data:', stored);

    if (!stored) {
      console.log('⚠️ [BOOTSTRAP] no tokens found in keychain');
      dispatch(authFinish());
      return;
    }

    const payload = {
      accessToken: stored.accessToken ?? null,
      refreshToken: stored.refreshToken ?? null,
      sessionId: stored.sessionId ?? null,
      userAccountType: stored.userAccountType ?? null,
      userSubscription: stored.userSubscription ?? null,
      userId: stored.userId ?? null,
      userCountry: stored.userCountry ?? null,
      userShownearby: stored.userShownearby ?? null,
      creatorCreated: stored.creatorCreated ?? false,
    };

    console.log('🟢 [BOOTSTRAP] redux payload:', payload);

    dispatch(authSuccess(payload));

    console.log('✅ [BOOTSTRAP] redux hydrated');
  } catch (err) {
    console.error('❌ [BOOTSTRAP] error:', err.message);
    dispatch(authFinish());
  }
};
