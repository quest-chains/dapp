import { providers } from 'ethers';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import Web3Modal from 'web3modal';

import { isSupportedNetwork } from './helpers';
import { switchChainOnMetaMask } from './metamask';
import { CHAIN_ID, SUPPORTED_NETWORK_INFO } from './networks';
import { WEB3_MODAL_OPTIONS } from './options';

export type WalletContextType = {
  provider: providers.Web3Provider | null | undefined;
  chainId: string | null | undefined;
  address: string | null | undefined;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  isMetaMask: boolean | undefined;
};

export const WalletContext = createContext<WalletContextType>({
  provider: null,
  chainId: null,
  address: null,
  connectWallet: async () => undefined,
  disconnect: () => undefined,
  isConnecting: true,
  isConnected: false,
  isMetaMask: false,
});

type WalletStateType = {
  provider?: providers.Web3Provider | null;
  chainId?: string | null;
  address?: string | null;
  isMetaMask?: boolean;
};

const web3Modal =
  typeof window !== 'undefined' ? new Web3Modal(WEB3_MODAL_OPTIONS) : null;

export const WalletProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [walletState, setWalletState] = useState<WalletStateType>({});

  const { provider, chainId, address, isMetaMask } = walletState;

  const [isConnecting, setConnecting] = useState<boolean>(true);

  const isConnected: boolean = useMemo(
    () => !!provider && !!address && !!chainId && !isConnecting,
    [provider, address, chainId, isConnecting],
  );

  const disconnect = useCallback(async () => {
    web3Modal?.clearCachedProvider();
    setWalletState({});
  }, []);

  const setWalletProvider = useCallback(
    async (prov: providers.ExternalProvider) => {
      const ethersProvider = new providers.Web3Provider(prov);
      const network = (await ethersProvider.getNetwork()).chainId;
      const signerAddress = await ethersProvider.getSigner().getAddress();

      const chain = `0x${network.toString(16)}`;
      setWalletState({
        provider: ethersProvider,
        chainId: chain,
        address: signerAddress.toLowerCase(),
        isMetaMask: prov.isMetaMask,
      });
    },
    [],
  );

  const connectWallet = useCallback(async () => {
    if (!web3Modal) return;
    try {
      setConnecting(true);

      const modalProvider = await web3Modal.connect();
      let chainId = await modalProvider.request({
        method: 'eth_chainId',
      });
      const isMetaMask = modalProvider.isMetaMask;

      if (isMetaMask && !isSupportedNetwork(chainId)) {
        const success = await switchChainOnMetaMask(CHAIN_ID);
        if (success) {
          chainId = CHAIN_ID;
        }
      }

      if (isSupportedNetwork(chainId)) {
        await setWalletProvider(modalProvider);

        modalProvider.on('accountsChanged', () => {
          setWalletProvider(modalProvider);
        });
        modalProvider.on('chainChanged', async (chainId: string) => {
          if (isSupportedNetwork(chainId)) {
            setWalletProvider(modalProvider);
          } else {
            let success = false;
            if (isMetaMask) {
              setConnecting(true);
              success = await switchChainOnMetaMask(CHAIN_ID);
              setConnecting(false);
            }
            if (!success) {
              toast.error(
                `Network not supported, please switch to ${SUPPORTED_NETWORK_INFO[CHAIN_ID].name}`,
              );
              disconnect();
            }
          }
        });
      } else {
        toast.error(
          `Network not supported, please switch to ${SUPPORTED_NETWORK_INFO[CHAIN_ID].name}`,
        );
        disconnect();
      }
    } catch (web3Error) {
      // eslint-disable-next-line no-console
      console.error(web3Error);
      disconnect();
    } finally {
      setConnecting(false);
    }
  }, [setWalletProvider, disconnect]);

  useEffect(() => {
    if (web3Modal?.cachedProvider) {
      connectWallet();
    } else {
      setConnecting(false);
    }
  }, [connectWallet]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        address,
        chainId,
        connectWallet,
        isConnected,
        isConnecting,
        disconnect,
        isMetaMask,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
