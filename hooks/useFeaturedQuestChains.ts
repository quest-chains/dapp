import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/utils/constants';

const featuredQuestChains = [
  {
    chainId: '0x5',
    address: '0x674c8a0e864ccf8906c5e3644e462473918e9362',
  },
  {
    chainId: '0x5',
    address: '0xe610513b10a238d1f1e54a114f327473af9e08b8',
  },
  {
    chainId: '0x89',
    address: '0x0fe8c3464aa12eb43ec3f0322e4631479f16ddd6',
  },
  {
    chainId: '0x89',
    address: '0x95e95570182da4d7aa9059faa61dabc1be24d2d8',
  },
  {
    chainId: '0x89',
    address: '0xe62bda16bc819840e6369fd3b5db528929932b01',
  },
  {
    chainId: '0x89',
    address: '0xe388d673dcb58b6216d869801710e498fe37f24c',
  },
  {
    chainId: '0x89',
    address: '0x7d026f18668db9be9835c4a406afa3d50169cb9e',
  },
];

const networkAddresses = featuredQuestChains.reduce(
  (t: Record<string, string[]>, a: { address: string; chainId: string }) => {
    if (SUPPORTED_NETWORKS.includes(a.chainId)) {
      if (t[a.chainId]) {
        return { ...t, [a.chainId]: [...t[a.chainId], a.address] };
      } else {
        return { ...t, [a.chainId]: [a.address] };
      }
    }
    return t;
  },
  {},
);

export const useFeaturedQuestChains = (): {
  error: unknown;
  fetching: boolean;
  results: graphql.QuestChainDisplayFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<graphql.QuestChainDisplayFragment[]>(
    [],
  );

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);

        const allResults = await Promise.all(
          Object.entries(networkAddresses).map(async ([chainId, addresses]) =>
            graphql.getQuestChainsFromAddresses(chainId, addresses),
          ),
        );
        const chains = allResults.reduce((t, a) => {
          t.push(...a);
          return t;
        }, []);

        if (!isMounted) return;

        // MAX 6 FEATURED
        setResults(chains.slice(0, 6));
      } catch (err) {
        setError(err);
        setResults([]);
      } finally {
        setFetching(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    fetching,
    error,
    results,
  };
};
