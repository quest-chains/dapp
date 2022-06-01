/* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { getQuestChainsToReview } from '@/graphql/questReviews';
import { QuestChainReviewInfoFragment } from '@/graphql/types';
import { NETWORK_INFO } from '@/web3';

const chainIds = Object.keys(NETWORK_INFO);

export const useQuestsToReviewForAllChains = (
  address: string,
): {
  error: unknown;
  fetching: boolean;
  results: QuestChainReviewInfoFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<QuestChainReviewInfoFragment[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!address) return;
      try {
        setFetching(true);
        const allResults = await Promise.all(
          chainIds.map(async chainId =>
            getQuestChainsToReview(chainId, address),
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
