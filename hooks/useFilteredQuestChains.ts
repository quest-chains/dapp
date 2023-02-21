import { graphql } from '@quest-chains/sdk';
import { isSupportedNetwork } from '@quest-chains/sdk/dist/graphql';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/utils/constants';

export const useFilteredQuestChains = (
  filters: graphql.QuestChainFiltersInfo,
  network: string | undefined = undefined,
): {
  error: unknown;
  fetching: boolean;
  results: graphql.QuestChainInfoFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<graphql.QuestChainInfoFragment[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        let chains: graphql.QuestChainInfoFragment[] = [];

        if (network && isSupportedNetwork(network)) {
          chains = await graphql.getQuestChainsFromFilters(network, filters);
        } else {
          const allResults = await Promise.all(
            SUPPORTED_NETWORKS.map(async n =>
              graphql.getQuestChainsFromFilters(n, filters),
            ),
          );
          chains = allResults.reduce((t, a) => {
            t.push(...a);
            return t;
          }, []);
        }
        if (!isMounted) return;

        setResults(chains);
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
  }, [filters, network]);

  return {
    fetching,
    error,
    results,
  };
};
