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
    address: '0x64baec377babbbb62419af890e459d0a26b11074',
  },
  {
    chainId: '0x89',
    address: '0x0bf17bedbd42f6cf89f4064d5d70da1e44f70f14',
  },
  {
    chainId: '0x89',
    address: '0x5d8c1d6eab5fd643ad60dce741310dae3807acfc',
  },
  {
    chainId: '0x89',
    address: '0x1ed08e85b948566623cc23c3744e5abe656e9564',
  },
  {
    chainId: '0x89',
    address: '0x6a7f3c7c2c00d169dfdb2a462839a1741942cd78',
  },
  // testnet quest chains are only featured in `dev.questchains.xyz`
  {
    chainId: '0x5',
    address: '0x674c8a0e864ccf8906c5e3644e462473918e9362',
  },
  {
    chainId: '0x5',
    address: '0xe610513b10a238d1f1e54a114f327473af9e08b8',
  },
].map(a => ({
  chainId: a.chainId.toLowerCase(),
  address: a.address.toLowerCase(),
}));

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

        // sort the array by the order of the featured quest chains
        const sortedChains = chains.sort((a, b) => {
          const aIndex = featuredQuestChains.findIndex(
            f => f.address === a.address && f.chainId === a.chainId,
          );
          const bIndex = featuredQuestChains.findIndex(
            f => f.address === b.address && f.chainId === b.chainId,
          );
          return aIndex - bIndex;
        });

        if (!isMounted) return;

        // max 6 featured quest chains
        setResults(sortedChains.slice(0, 6));
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
