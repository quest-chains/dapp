export const STORAGE_KEYS = {
  IPFS_GATEWAY: 'quest-chains-ipfs-gateway',
  AUTH_TOKEN: 'quest-chains-auth-token',
};

export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(key);
};

export const getFromStorage = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(key);
};

export const setInStorage = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(key, value);
};
