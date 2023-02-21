import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/utils/constants';

export const useQuestChainSearchForAllChains = (
  search: graphql.QuestChainFiltersInfo,
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
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
            graphql.getQuestChainsFromFilters(chainId, search),
          ),
        );
        if (!isMounted) return;

        setResults(
          allResults
            .reduce((t, a) => {
              t.push(...a);
              return t;
            }, [])
            .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt)),
        );
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
  }, [search]);

  return {
    fetching,
    error,
    results,
  };
};
