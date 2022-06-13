import { StaticJsonRpcProvider } from '@ethersproject/providers';
import memoize from 'fast-memoize';

import { AVAILABLE_NETWORK_INFO } from './networks';

const memoized = memoize((url: string) => new StaticJsonRpcProvider(url));

export const getEthersProvider = (
  chainId: string,
): StaticJsonRpcProvider | null => {
  const networkConfig = AVAILABLE_NETWORK_INFO[chainId];
  if (!networkConfig) return null;
  const { rpc } = networkConfig;

  return memoized(rpc);
};
