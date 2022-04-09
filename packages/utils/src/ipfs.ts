import IPFSClient from 'ipfs-http-client';
import { Web3Storage } from 'web3.storage';
import schema from './schema.json';
import { createReadStream } from 'fs';
import { mkdtemp, rmdir, unlink, writeFile } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import Ajv from 'ajv';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const ipfsTheGraph = new IPFSClient({
  protocol: 'https',
  host: 'api.thegraph.com',
  port: 443,
  'api-path': '/ipfs/api/v0/',
});

export type Metadata = {
  name: string;
  description: string;
  image_url?: string;
  external_url?: string;
};

const uploadToIPFSTheGraph = async (jsonString: string) => {
  const node = await ipfsTheGraph.add(Buffer.from(jsonString), {
    wrapWithDirectory: false,
  });
  console.log(node);
  const { hash } = node[0];
  await ipfsTheGraph.pin.add(hash);
  return hash;
};

export const uploadMetadata = async (
  metadata: Metadata,
  token: string = '',
): Promise<string> => {
  const valid = validate(metadata);
  if (!valid) throw new Error('Invalid metadata: schema validation failed');
  if (!token) throw new Error('Invalid web3.storage token');
  const web3Storage = new Web3Storage({ token });

  const jsonString = JSON.stringify(metadata, undefined, 2);

  const name = path.join(
    await mkdtemp(path.join(os.tmpdir(), 'metadatas')),
    'metadata.json',
  );
  await writeFile(name, jsonString);

  const readable = createReadStream(name) as unknown as ReadableStream<string>;

  const tmpFile = {
    name: 'metadata.json',
    stream: () => readable,
  };

  const [hash1, hash2] = await Promise.all([
    uploadToIPFSTheGraph(jsonString),
    web3Storage.put([tmpFile], { wrapWithDirectory: false }),
  ]);

  console.log({ hash1, hash2 });

  if (hash1 !== hash2)
    throw new Error('Unidentical hashes from IPFS and web3.storage');

  await unlink(name);
  await rmdir(path.dirname(name));

  return hash1;
};
