import { INFURA_ID, SUPPORTED_NETWORKS } from '../utils/constants';
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
    rpc: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    image: EthereumImage.src,
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
  },
  '0x5': {
    chainId: '0x5',
    name: 'Görli Testnet',
    label: 'Görli',
    urlName: 'goerli',
    symbol: 'ETH',
    explorer: 'https://goerli.etherscan.io',
    explorerLabel: 'EtherScan',
    rpc: `https://goerli.infura.io/v3/${INFURA_ID}`,
    image: EthereumImage.src,
  },
  '0x13881': {
    chainId: '0x13881',
    name: 'Mumbai Testnet',
    label: 'Mumbai',
    urlName: 'mumbai',
    symbol: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com',
    explorerLabel: 'PolygonScan',
    rpc: 'https://rpc-mumbai.maticvigil.com',
    image: PolygonImage.src,
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
  },
  '0x66eed': {
    chainId: '0x66eed',
    name: 'Arbitrum Goerli',
    label: 'Arbitrum Goerli',
    urlName: 'arbitrum-goerli',
    symbol: 'ETH',
    explorer: 'https://goerli.arbiscan.io',
    explorerLabel: 'ArbiScan',
    rpc: 'https://goerli-rollup.arbitrum.io/rpc',
    image: ArbitrumImage.src,
  },
};

export const CHAIN_URL_MAPPINGS: {
  [chainId: string]: string;
} = {
  polygon: '0x89',
  gnosis: '0x64',
  goerli: '0x5',
  optimism: '0xa',
  arbitrum: '0xa4b1',
  ['arbitrum-goerli']: '0x66eed',
  mumbai: '0x13881',
  mainnet: '0x1',
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
  return AVAILABLE_NETWORK_INFO;
};

export const SUPPORTED_NETWORK_INFO = getNetworkInfo(SUPPORTED_NETWORKS);

export const CHAIN_ID = SUPPORTED_NETWORKS[0];
