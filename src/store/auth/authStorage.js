import * as Keychain from 'react-native-keychain';

const KEYCHAIN_SERVICE = 'authTokens';

/* ============================
   LOAD TOKENS
============================ */
export async function loadTokens() {
  try {
    const creds = await Keychain.getGenericPassword({
      service: KEYCHAIN_SERVICE,
    });

    if (!creds || !creds.password) {
      return null;
    }

    return JSON.parse(creds.password);
  } catch (err) {
    console.error('Keychain load error:', err.message);
    return null;
  }
}

/* ============================
   SAVE TOKENS
============================ */
export async function saveTokens(tokenData) {
  try {
    await Keychain.setGenericPassword('auth', JSON.stringify(tokenData), {
      service: KEYCHAIN_SERVICE,
    });
    return true;
  } catch (err) {
    console.error('Keychain save error:', err.message);
    return false;
  }
}

/* ============================
   CLEAR TOKENS
============================ */
export async function clearTokens() {
  try {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
  } catch (err) {
    console.error('Keychain clear error:', err.message);
  }
}
