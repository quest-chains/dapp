import { useContext } from 'react';
import { WalletContext, WalletContextType } from 'web3/WalletContext';

export const useWallet: () => WalletContextType = () =>
  useContext(WalletContext);

export * from './useENS';
