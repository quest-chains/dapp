import { Client, createClient } from 'urql';

import { NETWORK_INFO } from '@/web3/networks';

export const clients: Record<string, Client> = Object.values(
  NETWORK_INFO,
).reduce<Record<string, Client>>((o, info) => {
  o[info.chainId] = createClient({
    url: info.subgraphUrl,
  });
  return o;
}, {});
