import { graphql } from '@quest-chains/sdk';
import { GlobalInfoFragment } from '@quest-chains/sdk/dist/graphql';
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

import {
  fetchAvatarFromAddressOrENS,
  fetchENSFromAddress,
} from '@/hooks/useENS';
import { MongoUser } from '@/lib/mongodb/types';
import { fetchWithHeaders } from '@/utils/fetchWithHeaders';
import { removeFromStorage, STORAGE_KEYS } from '@/utils/storageHelpers';

import { authenticateWallet } from './auth';
import { isSupportedNetwork } from './helpers';
import { switchChainOnMetaMask } from './metamask';
import { CHAIN_ID, SUPPORTED_NETWORK_INFO } from './networks';
import { WEB3_MODAL_OPTIONS } from './options';

export type WalletContextType = {
  provider: providers.Web3Provider | null | undefined;
  chainId: string | null | undefined;
  address: string | null | undefined;
  ens: string | null | undefined;
  ensAvatar: string | null | undefined;
  user: MongoUser | null | undefined;
  setUser: (_user: MongoUser | null | undefined) => void;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  isConnected: boolean;
  isMetaMask: boolean | undefined;
  globalInfo: Record<string, GlobalInfoFragment>;
};

export const WalletContext = createContext<WalletContextType>({
  provider: null,
  chainId: null,
  address: null,
  ens: null,
  ensAvatar: null,
  user: null,
  setUser: () => undefined,
  connectWallet: async () => undefined,
  disconnect: () => undefined,
  isConnecting: true,
  isConnected: false,
  isMetaMask: false,
  globalInfo: {},
});

type WalletStateType = {
  provider?: providers.Web3Provider | null;
  chainId?: string | null;
  address?: string | null;
  isMetaMask?: boolean;
};

const web3Modal =
  typeof window !== 'undefined' ? new Web3Modal(WEB3_MODAL_OPTIONS) : null;

const connectUserWithMongo = async (): Promise<MongoUser | null> => {
  const res = await fetchWithHeaders('/api/connect', 'POST');
  if (!res.ok || res.status !== 200) {
    console.error('Could not connect user');
    return null;
  }

  return (await res.json()) as MongoUser;
};

const fetchENSData = async (
  address: string,
): Promise<{ ens: string | null; ensAvatar: string | null }> => {
  const ens = await fetchENSFromAddress(address);
  const ensAvatar = await fetchAvatarFromAddressOrENS(ens);
  return { ens, ensAvatar };
};

export const WalletProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [walletState, setWalletState] = useState<WalletStateType>({});

  const { provider, chainId, address, isMetaMask } = walletState;

  const [{ ens, ensAvatar }, setENS] = useState<{
    ens?: string | null;
    ensAvatar?: string | null;
  }>({});

  const [user, setUser] = useState<MongoUser | null>();

  const [isConnecting, setConnecting] = useState<boolean>(true);

  const isConnected: boolean = useMemo(
    () => !!provider && !!address && !!chainId && !isConnecting,
    [provider, address, chainId, isConnecting],
  );

  const disconnect = useCallback(async () => {
    removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    web3Modal?.clearCachedProvider();
    setWalletState({});
  }, []);

  const setWalletProvider = useCallback(
    async (prov: providers.ExternalProvider, onlyNetworkChange = false) => {
      const ethersProvider = new providers.Web3Provider(prov);
      const network = (await ethersProvider.getNetwork()).chainId;
      const chainId = `0x${network.toString(16)}`;

      if (onlyNetworkChange) {
        setWalletState(old => ({ ...old, chainId }));
      } else {
        const signerAddress = await ethersProvider.getSigner().getAddress();

        // setup ens in background
        fetchENSData(signerAddress).then(setENS);

        // sign message in foreground
        const token = await authenticateWallet(ethersProvider);
        if (!token) throw new Error('Could not authenticate wallet');

        // connect user with backend database in background
        connectUserWithMongo().then(setUser);

        setWalletState({
          provider: ethersProvider,
          chainId,
          address: signerAddress.toLowerCase(),
          isMetaMask: prov.isMetaMask,
        });
      }
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
            setWalletProvider(modalProvider, true);
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

  const [globalInfo, setGlobalInfo] = useState<
    Record<string, GlobalInfoFragment>
  >({});

  useEffect(() => {
    graphql.getGlobalInfo().then(setGlobalInfo);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        provider,
        address,
        ens,
        ensAvatar,
        user,
        setUser,
        chainId,
        connectWallet,
        isConnected,
        isConnecting,
        disconnect,
        isMetaMask,
        globalInfo,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
