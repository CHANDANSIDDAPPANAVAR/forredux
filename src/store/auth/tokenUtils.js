import { Buffer } from 'buffer';

/* =====================================
   DECODE JWT
===================================== */
export function decodeJWT(token) {
  try {
    if (!token || typeof token !== 'string') {
      return {};
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return {};
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf8');

    return JSON.parse(json);
  } catch {
    return {};
  }
}

/* =====================================
   CHECK TOKEN EXPIRY
===================================== */
export function isTokenExpired(token, bufferSeconds = 0) {
  if (!token) {
    return true;
  }

  const decoded = decodeJWT(token);

  if (!decoded.exp) {
    return true;
  }

  const expiryTime = decoded.exp * 1000;
  const bufferTime = bufferSeconds * 1000;

  return Date.now() >= expiryTime - bufferTime;
}

/* =====================================
   GET TOKEN EXPIRY TIME (ms)
===================================== */
export function getTokenExpiry(token) {
  const decoded = decodeJWT(token);
  return decoded?.exp ? decoded.exp * 1000 : 0;
}
