import { useToast } from '@chakra-ui/react';
import { providers } from 'ethers';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { WEB3_MODAL_OPTIONS } from 'web3/options';
import Web3Modal from 'web3modal';

import { isSupportedNetwork } from './helpers';

export type WalletContextType = {
  provider: providers.Web3Provider | null | undefined;
  chainId: string | null | undefined;
  address: string | null | undefined;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  isMetamask: boolean;
};

export const WalletContext = createContext<WalletContextType>({
  provider: null,
  chainId: null,
  address: null,
  connectWallet: async () => undefined,
  disconnect: () => undefined,
  isConnecting: true,
  isConnected: false,
  isMetamask: false,
});

type WalletStateType = {
  provider?: providers.Web3Provider | null;
  chainId?: string | null;
  address?: string | null;
};

const isMetamaskProvider = (
  provider: providers.Web3Provider | null | undefined,
): boolean => provider?.connection?.url === 'metamask';

const web3Modal =
  typeof window !== 'undefined' ? new Web3Modal(WEB3_MODAL_OPTIONS) : null;

export const WalletProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [{ provider, chainId, address }, setWalletState] =
    useState<WalletStateType>({});

  const isConnected: boolean = useMemo(
    () => !!provider && !!address && !!chainId,
    [provider, address, chainId],
  );

  const toast = useToast();

  const [isConnecting, setConnecting] = useState<boolean>(true);
  const isMetamask = useMemo(() => isMetamaskProvider(provider), [provider]);

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
      });
    },
    [],
  );

  const connectWallet = useCallback(async () => {
    if (!web3Modal) return;
    try {
      setConnecting(true);

      const modalProvider = await web3Modal.connect();
      const chainId = modalProvider.chainId;
      if (isSupportedNetwork(chainId)) {
        await setWalletProvider(modalProvider);

        modalProvider.on('accountsChanged', () => {
          setWalletProvider(modalProvider);
        });
        modalProvider.on('chainChanged', (chainId: string) => {
          if (isSupportedNetwork(chainId)) {
            setWalletProvider(modalProvider);
          } else {
            toast({
              status: 'error',
              description:
                'Network not supported, please switch to one of the supported networks',
            });
            disconnect();
          }
        });
      } else {
        toast({
          status: 'error',
          description:
            'Network not supported, please switch to one of the supported networks',
        });
        disconnect();
      }
    } catch (web3Error) {
      // eslint-disable-next-line no-console
      console.error(web3Error);
      disconnect();
    } finally {
      setConnecting(false);
    }
  }, [setWalletProvider, disconnect, toast]);

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
        isMetamask,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
