import IPFSClient from 'ipfs-http-client';
import { Web3Storage } from 'web3.storage';
import { createReadStream } from 'fs';
import { mkdtemp, rmdir, unlink, writeFile } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { Metadata } from './metadata';
import { validateSchema } from './validate';

const ipfsTheGraph = new IPFSClient({
  protocol: 'https',
  host: 'api.thegraph.com',
  port: 443,
  'api-path': '/ipfs/api/v0/',
});

const uploadToIPFSTheGraph = async (jsonString: string) => {
  const node = await ipfsTheGraph.add(Buffer.from(jsonString));
  const { hash } = node[0];
  await ipfsTheGraph.pin.add(hash);
  return hash;
};

export const uploadMetadata = async (
  metadata: Metadata,
  token: string = '',
): Promise<string> => {
  const valid = validateSchema(metadata);
  if (!valid) throw new Error('Invalid metadata: schema validation failed');
  if (!token) throw new Error('Invalid web3.storage token');
  const web3Storage = new Web3Storage({ token });

  const jsonString = JSON.stringify(metadata, undefined, 2);

  const name = path.join(
    await mkdtemp(path.join(os.tmpdir(), 'metadatas-')),
    'metadata.json',
  );
  await writeFile(name, jsonString);

  const readable = createReadStream(name) as unknown as ReadableStream<string>;

  const tmpFile = {
    name: 'metadata.json',
    stream: () => readable,
  };

  const [_hashGraph, hashWeb3Storage] = await Promise.all([
    uploadToIPFSTheGraph(jsonString),
    web3Storage.put([tmpFile], { wrapWithDirectory: false }),
  ]);

  await ipfsTheGraph.pin.add(hashWeb3Storage);

  await unlink(name);
  await rmdir(path.dirname(name));

  return hashWeb3Storage;
};
