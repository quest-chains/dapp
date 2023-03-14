import { Web3Provider } from '@ethersproject/providers';

import { createToken, verifyToken } from '@/lib/auth';
import {
  getFromStorage,
  removeFromStorage,
  setInStorage,
  STORAGE_KEYS,
} from '@/utils/storageHelpers';

const getExistingToken = async (
  provider: Web3Provider,
): Promise<string | null> => {
  const tokenFromStorage = getFromStorage(STORAGE_KEYS.AUTH_TOKEN);
  if (!tokenFromStorage) return null;

  const token = tokenFromStorage.split(' ')[1];
  if (!token) return null;

  const signerAddress = await provider.getSigner().getAddress();
  const verifiedAddress = verifyToken(token);

  if (
    !verifiedAddress ||
    verifiedAddress.toLowerCase() !== signerAddress.toLowerCase()
  ) {
    removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    return null;
  }

  return token;
};

export const authenticateWallet = async (
  provider: Web3Provider,
): Promise<string> => {
  const existingToken = await getExistingToken(provider);
  const token = existingToken ?? (await createToken(provider));
  setInStorage(STORAGE_KEYS.AUTH_TOKEN, `Bearer ${token}`);
  return token;
};
