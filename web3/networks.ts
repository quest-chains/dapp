import { graphql } from '@quest-chains/sdk';

import ArbitrumImage from './images/arbitrum.svg';
import EthereumImage from './images/ethereum.svg';
import GnosisImage from './images/gnosis.svg';
import OptimismImage from './images/optimism.svg';
import PolygonImage from './images/polygon.svg';

export type NetworkInfo = {
  [chainId: string]: {
    chainId: string;
    name: string;
    label: string;
    urlName: string;
    symbol: string;
    explorer: string;
    explorerLabel: string;
    rpc: string;
    image: string;
    testnet: boolean;
  };
};

export const AVAILABLE_NETWORK_INFO: NetworkInfo = {
  '0x1': {
    chainId: '0x1',
    name: 'Ethereum Mainnet',
    label: 'ethereum',
    urlName: 'ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.com',
    explorerLabel: 'EtherScan',
    rpc: `https://1rpc.io/eth`,
    image: EthereumImage.src,
    testnet: false,
  },
  '0x89': {
    chainId: '0x89',
    name: 'Polygon Mainnet',
    label: 'Polygon',
    urlName: 'polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    explorerLabel: 'PolygonScan',
    rpc: `https://polygon-rpc.com`,
    image: PolygonImage.src,
    testnet: false,
  },
  '0x64': {
    chainId: '0x64',
    name: 'Gnosis Chain',
    label: 'Gnosis',
    urlName: 'gnosis',
    symbol: 'xDAI',
    explorer: 'https://gnosisscan.io',
    explorerLabel: 'GnosisScan',
    rpc: 'https://rpc.gnosischain.com/',
    image: GnosisImage.src,
    testnet: false,
  },
  '0xa': {
    chainId: '0xa',
    name: 'Optimism Mainnet',
    label: 'Optimism',
    urlName: 'optimism',
    symbol: 'ETH',
    explorer: 'https://optimistic.etherscan.io',
    explorerLabel: 'EtherScan',
    rpc: 'https://mainnet.optimism.io',
    image: OptimismImage.src,
    testnet: false,
  },
  '0xaa36a7': {
    chainId: '0xaa36a7',
    name: 'Sepolia Testnet',
    label: 'Sepolia',
    urlName: 'sepolia',
    symbol: 'ETH',
    explorer: 'https://sepolia.etherscan.io',
    explorerLabel: 'EtherScan',
    rpc: `https://1rpc.io/sepolia`,
    image: EthereumImage.src,
    testnet: true,
  },
  '0xa4b1': {
    chainId: '0xa4b1',
    name: 'Arbitrum One',
    label: 'Arbitrum',
    urlName: 'arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    explorerLabel: 'ArbiScan',
    rpc: 'https://arb1.arbitrum.io/rpc',
    image: ArbitrumImage.src,
    testnet: false,
  },
};

export const CHAIN_URL_MAPPINGS: {
  [chainName: string]: string;
} = {
  polygon: '0x89',
  gnosis: '0x64',
  optimism: '0xa',
  arbitrum: '0xa4b1',
  mainnet: '0x1',
  sepolia: '0xaa36a7',
};

const getNetworkInfo = (networks: string[] | undefined): NetworkInfo => {
  if (networks && networks.length > 0 && AVAILABLE_NETWORK_INFO) {
    return networks.reduce((t, n) => {
      if (AVAILABLE_NETWORK_INFO[n]) {
        return { ...t, [n]: AVAILABLE_NETWORK_INFO[n] };
      }
      return t;
    }, {});
  }
  return {};
};

const IS_TESTNET = process.env.NEXT_PUBLIC_IS_PRODUCTION !== 'true';

export const SUPPORTED_NETWORKS = graphql.SUPPORTED_NETWORKS.filter(
  n =>
    AVAILABLE_NETWORK_INFO[n] &&
    AVAILABLE_NETWORK_INFO[n].testnet === IS_TESTNET,
);

if (SUPPORTED_NETWORKS.length === 0) {
  throw new Error('No supported networks found');
}

export const SUPPORTED_NETWORK_INFO = getNetworkInfo(SUPPORTED_NETWORKS);

export const CHAIN_ID = SUPPORTED_NETWORKS[0];
