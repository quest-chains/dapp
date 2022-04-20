import EthereumImage from '@/assets/ethereum.svg';
// import GnosisImage from '@/assets/gnosis.svg';
import PolygonImage from '@/assets/polygon.svg';
import { INFURA_ID } from '@/utils/constants';

export type NetworkInfo = {
  [chainId: string]: {
    chainId: string;
    name: string;
    label: string;
    symbol: string;
    explorer: string;
    explorerLabel: string;
    rpc: string;
    subgraphName: string;
    subgraphUrl: string;
    image: string;
  };
};

export const NETWORK_INFO: NetworkInfo = {
  // '0x1': {
  //   chainId: '0x1',
  //   name: 'Ethereum Mainnet',
  //   label: 'Ethereum',
  //   symbol: 'ETH',
  //   explorer: 'https://etherscan.io',
  //   explorerLabel: 'Etherscan',
  //   rpc: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  //   image: EthereumImage.src,
  // },
  // '0x89': {
  //   chainId: '0x89',
  //   name: 'Polygon Mainnet',
  //   label: 'Polygon',
  //   symbol: 'MATIC',
  //   explorer: 'https://polygonscan.com',
  //   explorerLabel: 'PolygonScan',
  //   rpc: `https://polygon-rpc.com`,
  //   image: PolygonImage.src,
  // },
  // '0x64': {
  //   chainId: '0x64',
  //   name: 'Gnosis Chain',
  //   label: 'Gnosis',
  //   symbol: 'xDAI',
  //   explorer: 'https://blockscout.com/xdai/mainnet',
  //   explorerLabel: 'Blockscout',
  //   rpc: 'https://rpc.gnosischain.com/',
  //   image: GnosisImage.src,
  // },
  '0x4': {
    chainId: '0x4',
    name: 'Rinkeby Testnet',
    label: 'Rinkeby',
    symbol: 'ETH',
    explorer: 'https://rinkeby.etherscan.io',
    explorerLabel: 'Etherscan',
    rpc: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    subgraphName: 'dan13ram/quest-chains-rinkeby',
    subgraphUrl:
      'https://api.thegraph.com/subgraphs/name/dan13ram/quest-chains-rinkeby',
    image: EthereumImage.src,
  },
  '0x13881': {
    chainId: '0x13881',
    name: 'Polygon Mumbai',
    label: 'Mumbai',
    symbol: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com',
    explorerLabel: 'PolygonScan',
    rpc: 'https://rpc-mumbai.maticvigil.com',
    subgraphName: 'dan13ram/quest-chains-mumbai',
    subgraphUrl:
      'https://api.thegraph.com/subgraphs/name/dan13ram/quest-chains-mumbai',
    image: PolygonImage.src,
  },
};

export const CHAIN_ID = Object.keys(NETWORK_INFO)[0];
