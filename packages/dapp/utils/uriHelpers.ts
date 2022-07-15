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

export const uriToHttpAsArray = (uri: string): string[] => {
  if (!uri) return [];
  if (uri.startsWith('data')) return [uri];
  const { protocol, hash, name } = parseUri(uri);

  switch (protocol) {
    case 'https':
      return [uri];
    case 'http':
      return [`https${uri.slice(4)}`, uri];
    case 'ipfs':
      if (hash.startsWith('ipfs')) {
        const newHash = hash.split('/')[1];
        return [
          `https://ipfs.infura.io/ipfs/${newHash}/`,
          `https://gateway.pinata.cloud/ipfs/${newHash}/`,
          `https://ipfs.io/ipfs/${newHash}/`,
        ];
      }
      return [
        `https://ipfs.infura.io/ipfs/${hash}/`,
        `https://gateway.pinata.cloud/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
      ];
    case 'ipns':
      return [
        `https://ipfs.infura.io/ipns/${name}/`,
        `https://gateway.pinata.cloud/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
};

export const ipfsUriToHttp = (uri: string | null | undefined): string => {
  if (!uri) return '';
  const { protocol, hash } = parseUri(uri);
  if (protocol !== 'ipfs' || !hash) return '';

  if (hash.includes('/')) {
    const slashIndex = hash.indexOf('/');
    return `https://${hash.substring(
      0,
      slashIndex,
    )}.ipfs.infura-ipfs.io${hash.substring(slashIndex)}`;
  }
  return `https://${hash}.ipfs.infura-ipfs.io`;
};
