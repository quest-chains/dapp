import { StaticJsonRpcProvider } from '@ethersproject/providers';
import memoize from 'fast-memoize';
import { NETWORK_INFO } from 'web3/networks';

const memoized = memoize((url: string) => new StaticJsonRpcProvider(url));

export const getEthersProvider = (
  chainId: string,
): StaticJsonRpcProvider | null => {
  const networkConfig = NETWORK_INFO[chainId];
  if (!networkConfig) return null;
  const { rpc } = networkConfig;

  return memoized(rpc);
};
