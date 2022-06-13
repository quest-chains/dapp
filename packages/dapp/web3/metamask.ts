import { utils } from 'ethers';

import { SUPPORTED_NETWORK_INFO } from './networks';

export const switchChainOnMetaMask = async (
  chainId: string,
): Promise<boolean> => {
  if (!SUPPORTED_NETWORK_INFO[chainId]) {
    // eslint-disable-next-line no-console
    console.error(`No network configuration found for chainId ${chainId}`);
    return false;
  }

  const { name, symbol, explorer, rpc } = SUPPORTED_NETWORK_INFO[chainId];

  if (!(name && symbol && rpc && explorer && window.ethereum?.isMetaMask)) {
    // eslint-disable-next-line no-console
    console.error('Switching chain is only supported in Metamask');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: utils.hexValue(chainId),
        },
      ],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((switchError as { code?: number }).code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: utils.hexValue(chainId),
              chainName: name,
              nativeCurrency: {
                name: symbol,
                symbol,
                decimals: 18,
              },
              rpcUrls: [rpc],
              blockExplorerUrls: [explorer],
            },
          ],
        });
        return true;
      } catch (addError) {
        // eslint-disable-next-line no-console
        console.error(`Unable to add chainId ${chainId} to metamask`, addError);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error(
        `Unable to switch to chainId ${chainId} on metamask`,
        switchError,
      );
    }
  }
  return false;
};
