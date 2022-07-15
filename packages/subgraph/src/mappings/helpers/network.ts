import { dataSource } from '@graphprotocol/graph-ts';

export function getNetwork(): string {
  const network = dataSource.network();
  if (network == 'mainnet') return '0x1';
  else if (network == 'kovan') return '0x2a';
  else if (network == 'rinkeby') return '0x4';
  else if (network == 'ropsten') return '0x3';
  else if (network == 'goerli') return '0x5';
  else if (network == 'poa-core') return '0x63';
  else if (network == 'poa-sokol') return '0x4d';
  else if (network == 'xdai') return '0x64';
  else if (network == 'matic') return '0x89';
  else if (network == 'mumbai') return '0x13881';
  else if (network == 'arbitrum-one') return '0xa4b1';
  else if (network == 'arbitrum-rinkeby') return '0x66eeb';
  else if (network == 'optimism') return '0xa';
  else if (network == 'optimism-kovan') return '0x45';
  else if (network == 'aurora') return '0x4e454152';
  else if (network == 'aurora-testnet') return '0x4e454153';
  else return 'unknown';
}
