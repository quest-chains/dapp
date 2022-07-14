import { ipfs, json, log } from '@graphprotocol/graph-ts';

class Metadata {
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  animationUrl: string | null;
  externalUrl: string | null;
  mimeType: string | null;

  constructor() {
    this.name = null;
    this.description = null;
    this.imageUrl = null;
    this.animationUrl = null;
    this.externalUrl = null;
    this.mimeType = null;
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
      let imageUrl = data.get('image_url');
      if (imageUrl != null && !imageUrl.isNull()) {
        metadata.imageUrl = imageUrl.toString();
      }
      let animationUrl = data.get('animation_url');
      if (animationUrl != null && !animationUrl.isNull()) {
        metadata.animationUrl = animationUrl.toString();
      }
      let externalUrl = data.get('external_url');
      if (externalUrl != null && !externalUrl.isNull()) {
        metadata.externalUrl = externalUrl.toString();
      }
      let mimeType = data.get('mime_type');
      if (mimeType != null && !mimeType.isNull()) {
        metadata.mimeType = mimeType.toString();
      }
    } else {
      log.warning('could not get IPFS details from hash {}', [hash]);
    }
  }

  return metadata;
}
