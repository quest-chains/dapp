import { useEffect, useState } from 'react';

import { getQuestChainsFromSearch } from '@/graphql/questChains';
import { QuestChainInfoFragment } from '@/graphql/types';
import { SUPPORTED_NETWORKS } from '@/utils/constants';

export const useQuestChainSearchForAllChains = (
  search: string,
): {
  error: unknown;
  fetching: boolean;
  results: QuestChainInfoFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<QuestChainInfoFragment[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
            getQuestChainsFromSearch(chainId, search),
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
