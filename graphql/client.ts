import { Client, createClient, dedupExchange, fetchExchange } from 'urql';

import { SUPPORTED_NETWORK_INFO } from '@/web3/networks';

export const clients: Record<string, Client> = Object.values(
  SUPPORTED_NETWORK_INFO,
).reduce<Record<string, Client>>((o, info) => {
  o[info.chainId] = createClient({
    url: info.subgraphUrl,
    exchanges: [dedupExchange, fetchExchange],
  });
  return o;
}, {});
