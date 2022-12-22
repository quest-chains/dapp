import { INFURA_ID, SUPPORTED_NETWORKS } from '../utils/constants';
import EthereumImage from './images/ethereum.svg';
import GnosisImage from './images/gnosis.svg';
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
    subgraphName: string;
    subgraphUrl: string;
    image: string;
  };
};

export const CHAIN_URL_MAPPINGS: { [chainId: string]: string } = {
  ethereum: '0x1',
  polygon: '0x89',
  xdai: '0x64',
  goerli: '0x5',
  mumbai: '0x13881',
};

export const AVAILABLE_NETWORK_INFO: NetworkInfo = {
  '0x1': {
    chainId: '0x1',
    name: 'Ethereum Mainnet',
    label: 'Ethereum',
    urlName: CHAIN_URL_MAPPINGS.ethereum,
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    explorerLabel: 'Etherscan',
    rpc: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    image: EthereumImage.src,
    // TODO: deploy contract & subgraph
    subgraphName: 'quest-chains/quest-chains-mainnet',
    subgraphUrl:
      'https://api.thegraph.com/subgraphs/name/quest-chains/quest-chains-mainnet',
  },
  '0x89': {
    chainId: '0x89',
    name: 'Polygon Mainnet',
    label: 'Polygon',
    urlName: CHAIN_URL_MAPPINGS.polygon,
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    explorerLabel: 'PolygonScan',
    rpc: `https://polygon-rpc.com`,
    image: PolygonImage.src,
    subgraphName: 'quest-chains/quest-chains-polygon',
    subgraphUrl:
      'https://api.thegraph.com/subgraphs/name/quest-chains/quest-chains-polygon',
  },
  '0x64': {
    chainId: '0x64',
    name: 'Gnosis Chain',
    label: 'Gnosis',
    urlName: CHAIN_URL_MAPPINGS.xdai,
    symbol: 'xDAI',
    explorer: 'https://blockscout.com/xdai/mainnet',
    explorerLabel: 'Blockscout',
    rpc: 'https://rpc.gnosischain.com/',
    image: GnosisImage.src,
    subgraphName: 'quest-chains/quest-chains-xdai',
    subgraphUrl:
      'https://api.thegraph.com/subgraphs/name/quest-chains/quest-chains-xdai',
  },
  '0x5': {
    chainId: '0x5',
    name: 'Görli Testnet',
    label: 'Görli',
    urlName: CHAIN_URL_MAPPINGS.goerli,
    symbol: 'ETH',
    explorer: 'https://goerli.etherscan.io',
    explorerLabel: 'Etherscan',
    rpc: `https://goerli.infura.io/v3/${INFURA_ID}`,
    image: EthereumImage.src,
    subgraphName: 'quest-chains/quest-chains-goerli',
    subgraphUrl:
      'https://api.thegraph.com/subgraphs/name/quest-chains/quest-chains-goerli',
  },
  '0x13881': {
    chainId: '0x13881',
    name: 'Mumbai Testnet',
    label: 'Mumbai',
    urlName: CHAIN_URL_MAPPINGS.mumbai,
    symbol: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com',
    explorerLabel: 'PolygonScan',
    rpc: 'https://rpc-mumbai.maticvigil.com',
    image: PolygonImage.src,
    subgraphName: 'quest-chains/quest-chains-mumbai',
    subgraphUrl:
      'https://api.thegraph.com/subgraphs/name/quest-chains/quest-chains-mumbai',
  },
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
