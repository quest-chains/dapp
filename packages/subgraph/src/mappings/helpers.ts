import {
  Bytes,
  Address,
  ipfs,
  json,
  dataSource,
  log,
} from '@graphprotocol/graph-ts';
import { User } from '../types/schema';
import { QuestChain as QuestChainContract } from '../types/templates/QuestChain/QuestChain';

class Metadata {
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  externalUrl: string | null;

  constructor() {
    this.name = null;
    this.description = null;
    this.imageUrl = null;
    this.externalUrl = null;
  }
}

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

export function fetchMetadata(details: string): Metadata {
  let parts = details.split('/');
  let hash = parts.length > 0 ? parts[parts.length - 1] : '';
  let metadata = new Metadata();
  if (hash != '') {
    let ipfsData = ipfs.cat(hash);
    if (ipfsData !== null) {
      log.info('IPFS details from hash {}, data {}', [
        details,
        ipfsData.toString(),
      ]);
      let data = json.fromBytes(ipfsData).toObject();
      let name = data.get('name');
      if (name != null && !name.isNull()) {
        metadata.name = name.toString();
      }
      let description = data.get('description');
      if (description != null && !description.isNull()) {
        metadata.description = description.toString();
      }
      let imageUrl = data.get('image_url');
      if (imageUrl != null && !imageUrl.isNull()) {
        metadata.imageUrl = imageUrl.toString();
      }
      let externalUrl = data.get('external_url');
      if (externalUrl != null && !externalUrl.isNull()) {
        metadata.externalUrl = externalUrl.toString();
      }
    } else {
      log.warning('could not get IPFS details from hash {}', [hash]);
    }
  }

  return metadata;
}

export function getRoles(address: Address): Bytes[] {
  let chain = QuestChainContract.bind(address);
  let try_ADMIN_ROLE = chain.try_ADMIN_ROLE();
  let try_EDITOR_ROLE = chain.try_EDITOR_ROLE();
  let try_REVIEWER_ROLE = chain.try_REVIEWER_ROLE();
  return [
    try_ADMIN_ROLE.reverted ? Bytes.fromI32(0) : try_ADMIN_ROLE.value,
    try_EDITOR_ROLE.reverted ? Bytes.fromI32(0) : try_EDITOR_ROLE.value,
    try_REVIEWER_ROLE.reverted ? Bytes.fromI32(0) : try_REVIEWER_ROLE.value,
  ];
}

export function getUser(address: Address): User {
  let user = User.load(address.toHexString());
  if (user == null) {
    user = new User(address.toHexString());
  }
  return user as User;
}

export function removeFromArray(arr: string[], item: string): string[] {
  let newArr = new Array<string>();
  for (let i = 0; i < arr.length; i = i + 1) {
    if (arr[i] != item) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
}

export function createSearchString(
  name: string | null,
  description: string | null,
): string | null {
  if (name == null && description == null) return null;

  if (description == null) {
    return (name as String).toLowerCase();
  }

  if (name == null) {
    return (description as String).toLowerCase();
  }

  return (name as String)
    .toLowerCase()
    .concat(' ')
    .concat((description as String).toLowerCase());
}
