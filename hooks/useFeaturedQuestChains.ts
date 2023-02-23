import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/utils/constants';

const featuredQuestChains = [
  {
    chainId: '0x89',
    address: '0x9a2684fef5d043bf848999bbf66f0e66c3a4ce80',
  },
  {
    chainId: '0x89',
    address: '0x1ed08e85b948566623cc23c3744e5abe656e9564',
  },
  {
    chainId: '0x89',
    address: '0x6a7f3c7c2c00d169dfdb2a462839a1741942cd78',
  },
  {
    chainId: '0x89',
    address: '0xea512722cc047bfdbe90a1a2750491e89a818ca7',
  },
  {
    chainId: '0x89',
    address: '0x5408dd1a97d69453d768b762ccf64a8098488b34',
  },
  {
    chainId: '0x89',
    address: '0xa5c36c62ead5d3551aaf7765ee68e6f0ea3b3e1c',
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
          // sort the array by the order of the featuredQuestChains
          a.sort((a, b) => {
            const aIndex = featuredQuestChains.findIndex(
              f => f.address === a.address && f.chainId === a.chainId,
            );
            const bIndex = featuredQuestChains.findIndex(
              f => f.address === b.address && f.chainId === b.chainId,
            );
            return aIndex - bIndex;
          });

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
