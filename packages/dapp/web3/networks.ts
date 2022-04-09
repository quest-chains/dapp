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
  };
};

export const NETWORK_INFO: NetworkInfo = {
  '0x1': {
    chainId: '0x1',
    name: 'Ethereum Mainnet',
    label: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    explorerLabel: 'Etherscan',
    rpc: `https://mainnet.infura.io/v3/${INFURA_ID}`,
  },
  '0x89': {
    chainId: '0x89',
    name: 'Polygon Mainnet',
    label: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    explorerLabel: 'PolygonScan',
    rpc: `https://polygon-rpc.com`,
  },
  '0x13881': {
    chainId: '0x13881',
    name: 'Polygon Mumbai Testnet',
    label: 'Mumbai',
    symbol: 'MATIC',
    explorer: 'https://mumbai.polygonscan.com',
    explorerLabel: 'PolygonScan Mumbai',
    rpc: 'https://rpc-mumbai.maticvigil.com',
  },
};
