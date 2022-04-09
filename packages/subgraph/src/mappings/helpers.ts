import { Bytes, Address, ipfs, json, log } from '@graphprotocol/graph-ts';
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
      let imageUrl = data.get('imageUrl');
      if (imageUrl != null && !imageUrl.isNull()) {
        metadata.imageUrl = imageUrl.toString();
      }
      let externalUrl = data.get('externalUrl');
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
