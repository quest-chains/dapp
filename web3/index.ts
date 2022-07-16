import { useContext } from 'react';

import { WalletContext, WalletContextType } from './WalletContext';

export * from './helpers';
export * from './metamask';
export * from './networks';
export * from './providers';
export * from './WalletContext';

export const useWallet: () => WalletContextType = () =>
  useContext(WalletContext);
