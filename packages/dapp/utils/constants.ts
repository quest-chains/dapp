export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID ?? '0x13881';

export const INFURA_ID =
  process.env.NEXT_PUBLIC_INFURA_ID ?? '60a7b2c16321439a917c9e74a994f7df';

export const GRAPH_HEALTH_ENDPOINT =
  'https://api.thegraph.com/index-node/graphql';

export const SUBGRAPH_NAME =
  process.env.NEXT_PUBLIC_SUBGRAPH_NAME ?? 'dan13ram/quest-chains-mumbai';

export const GRAPH_URL = `https://api.thegraph.com/subgraphs/name/${SUBGRAPH_NAME}`;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const FACTORY_CONTRACT =
  process.env.NEXT_PUBLIC_FACTORY_CONTRACT ??
  '0x5977840c83B4f2Ba952D8001a647516c979915E4';

export const WEB3_STORAGE_TOKEN = process.env.NEXT_WEB3_STORAGE_TOKEN;

export const DAOQUEST_ADDRESS = '0x90Ea7E564b682eb5C13956ba682a23622791914A';
