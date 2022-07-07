import { utils as ethersUtils } from 'ethers';

import {
  AVAILABLE_NETWORK_INFO,
  CHAIN_ID,
  SUPPORTED_NETWORK_INFO,
} from './networks';

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

export const isSupportedNetwork = (
  chainId: string | null | undefined,
): boolean => {
  if (!chainId) return false;
  return Object.keys(SUPPORTED_NETWORK_INFO).includes(chainId);
};

export const getTxUrl = (
  txHash: string,
  chainId: string | null | undefined,
): string => {
  const { explorer } = AVAILABLE_NETWORK_INFO[chainId ?? CHAIN_ID];
  return `${explorer}/tx/${txHash}`;
};

export const getAddressUrl = (
  address: string,
  chainId: string | null | undefined,
): string => {
  const { explorer } = AVAILABLE_NETWORK_INFO[chainId ?? CHAIN_ID];
  return `${explorer}/address/${address}`;
};

export const getExplorerLabel = (
  chainId: string | null | undefined,
): string => {
  const { explorerLabel } = AVAILABLE_NETWORK_INFO[chainId ?? CHAIN_ID];
  return explorerLabel;
};
