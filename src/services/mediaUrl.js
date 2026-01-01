import { API_BASE_URL } from '@env';

/**
 * Build absolute media URL safely
 * - Supports relative paths from backend
 * - Supports full URLs (cdn, s3, etc.)
 * - Prevents double slashes
 */
export const mediaUrl = path => {
  if (!path) return null;

  // Already absolute URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const base = API_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');

  return `${base}/${cleanPath}`;
};
