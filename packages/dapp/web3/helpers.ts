import { utils as ethersUtils } from 'ethers';

import { CHAIN_ID, NETWORK_INFO } from './networks';

export const formatAddress = (
  address: string | null | undefined,
  ensName?: string | null,
  chars = 5,
): string => {
  if (ensName) return ensName;
  else if (address) {
    address = ethersUtils.getAddress(address); // eslint-disable-line no-param-reassign
    return `${address.substring(0, chars)}...${address.substring(
      address.length - chars,
    )}`;
  } else return '';
};

export const isSupportedNetwork = (chainId: string): boolean =>
  Object.keys(NETWORK_INFO).includes(chainId);

export const getTxUrl = (
  txHash: string,
  chainId: string = CHAIN_ID,
): string => {
  const { explorer } = NETWORK_INFO[chainId];
  return `${explorer}/tx/${txHash}`;
};

export const getAddressUrl = (
  address: string,
  chainId: string = CHAIN_ID,
): string => {
  const { explorer } = NETWORK_INFO[chainId];
  return `${explorer}/address/${address}`;
};

export const getExplorerLabel = (chainId: string = CHAIN_ID): string => {
  const { explorerLabel } = NETWORK_INFO[chainId];
  return explorerLabel;
};
