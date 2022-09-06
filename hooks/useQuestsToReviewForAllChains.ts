import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/utils/constants';

export const useQuestsToReviewForAllChains = (
  address: string | undefined | null,
): {
  error: unknown;
  fetching: boolean;
  results: graphql.QuestChainReviewInfoFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<
    graphql.QuestChainReviewInfoFragment[]
  >([]);

  useEffect(() => {
    if (!address) {
      setFetching(false);
      setError(new Error('No address provider'));
      setResults([]);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
            graphql.getQuestChainsToReview(chainId, address),
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
  }, [address]);

  return {
    fetching,
    error,
    results,
  };
};
