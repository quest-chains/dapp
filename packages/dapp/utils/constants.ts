/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID!;

export const SUPPORTED_NETWORKS = process.env
  .NEXT_PUBLIC_SUPPORTED_NETWORKS!.split(' ')
  .filter(n => !!n && !Number.isNaN(Number(n)))
  .map(n => `0x${Number(n).toString(16)}`);

export const WEB3_STORAGE_TOKEN = process.env.NEXT_WEB3_STORAGE_TOKEN!;

export const GRAPH_HEALTH_ENDPOINT =
  'https://api.thegraph.com/index-node/graphql';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const DAOQUEST_ADDRESS = '0x90Ea7E564b682eb5C13956ba682a23622791914A';

export const DAIx = '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f';
