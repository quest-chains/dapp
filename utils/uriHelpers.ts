import { AVAILABLE_NETWORK_INFO } from '@/web3';

import { QUESTCHAINS_URL } from './constants';
import { getFromStorage, STORAGE_KEYS } from './storageHelpers';

const IPFS_URL_ADDON = `ipfs/`;
const IPNS_URL_ADDON = `ipns/`;
const URL_ADDON_LENGTH = 5;

const parseUri = (
  uri: string,
): { protocol: string; hash: string; name: string } => {
  let protocol = uri.split(':')[0].toLowerCase();
  let hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2] ?? '';
  let name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2] ?? '';

  if (uri.includes(IPFS_URL_ADDON)) {
    protocol = 'ipfs';
    const hashIndex = uri.indexOf(IPFS_URL_ADDON) + URL_ADDON_LENGTH;
    hash = uri.substring(hashIndex);
  } else if (uri.includes(IPNS_URL_ADDON)) {
    protocol = 'ipns';
    const hashIndex = uri.indexOf(IPNS_URL_ADDON) + URL_ADDON_LENGTH;
    name = uri.substring(hashIndex);
  } else if (uri.startsWith('Qm') && uri.length === 46) {
    protocol = 'ipfs';
    hash = uri;
  } else if (uri.includes('ipfs') && uri.includes('Qm')) {
    protocol = 'ipfs';
    const hashIndex = uri.indexOf('Qm');
    hash = uri.substring(hashIndex);
  }

  return { protocol, hash, name };
};

export const IPFS_GATEWAYS = [
  'https://w3s.link',
  'https://gateway.pinata.cloud',
  'https://gateway.ipfs.io',
  'https://cloudflare-ipfs.com',
  'https://ipfs.io',
  'https://dweb.link',
];

const DEFAULT_IPFS_GATEWAY = IPFS_GATEWAYS[0];

export const getIPFSGateway = (): string => {
  const gateway = getFromStorage(STORAGE_KEYS.IPFS_GATEWAY);
  if (gateway) return gateway;
  return DEFAULT_IPFS_GATEWAY;
};

export const ipfsUriToHttp = (uri: string | null | undefined): string => {
  if (!uri) return '';
  if (uri.startsWith('data')) return uri;
  const { protocol, hash, name } = parseUri(uri);
  const ipfsGateway = getIPFSGateway();
  const url = new URL(ipfsGateway);

  switch (protocol) {
    case 'https':
    case 'http':
      return uri;
    case 'ipfs':
      return `${url.protocol}//${url.hostname}/ipfs/${hash}`;
    case 'ipns':
      return `${url.protocol}//${url.hostname}/ipns/${name}`;
    default:
      return '';
  }
};

const IMG_HASH = 'bafybeibwzifw52ttrkqlikfzext5akxu7lz4xiwjgwzmqcpdzmp3n5vnbe';

export const checkIPFSGateway = (gatewayUrl: string): Promise<void> => {
  const url = new URL(gatewayUrl);
  const imgUrl = new URL(
    `${url.protocol}//${
      url.hostname
    }/ipfs/${IMG_HASH}?now=${Date.now()}&filename=1x1.png#x-ipfs-companion-no-redirect`,
  );

  // we check if gateway is up by loading 1x1 px image:
  // this is more robust check than loading js, as it won't be blocked
  // by privacy protections present in modern browsers or in extensions such as Privacy Badger
  const imgCheckTimeout = 15000;
  return new Promise((resolve, reject) => {
    const timeout = () => {
      if (!timer) return false;
      clearTimeout(timer);
      timer = null;
      return true;
    };

    let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      if (timeout()) reject(new Error());
    }, imgCheckTimeout);
    const img = new Image();

    img.onerror = () => {
      timeout();
      reject(new Error());
    };

    img.onload = () => {
      // subdomain works
      timeout();
      resolve();
    };

    img.src = imgUrl.toString();
  });
};

export const getQuestChainURL = ({
  chainId,
  slug,
  address,
}: {
  chainId: string;
  slug?: string | null | undefined;
  address: string;
}) =>
  `${QUESTCHAINS_URL}/${AVAILABLE_NETWORK_INFO[chainId]?.urlName ?? chainId}/${
    slug || address
  }`;
