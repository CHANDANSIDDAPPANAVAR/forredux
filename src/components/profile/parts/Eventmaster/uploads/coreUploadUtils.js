import { Platform } from 'react-native';
import api from '../../../../../services/api';
export const isLocalFile = fileOrUri => {
  if (!fileOrUri) return false;

  const uri =
    typeof fileOrUri === 'string' ? fileOrUri : fileOrUri.uri || fileOrUri.url;

  if (!uri || typeof uri !== 'string') return false;

  return (
    uri.startsWith('file://') ||
    uri.startsWith('content://') ||
    uri.startsWith('/var/') ||
    uri.startsWith('/private/var/') ||
    uri.startsWith('/Users/') ||
    uri.startsWith('/storage/') ||
    uri.startsWith('/data/')
  );
};

const normalizeUri = uri =>
  Platform.OS === 'ios' && !uri.startsWith('file://') ? `file://${uri}` : uri;

export const uploadFile = async (file, type) => {
  const uri = normalizeUri(file.uri || file);
  const name = file.name || uri.split('/').pop();

  const form = new FormData();
  form.append('file', { uri, name, type: 'application/octet-stream' });

  const res = await api.post(`/api/user/upload?type=${type}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data?.url;
};
