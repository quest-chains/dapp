import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/utils/constants';

export const useUserBadgesForAllChains = (
  address: string,
): {
  error: unknown;
  fetching: boolean;
  results: (graphql.UserBadges | undefined | null)[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<
    (graphql.UserBadges | undefined | null)[]
  >([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
            graphql.getBadgesForUser(chainId, address ?? ''),
          ),
        );
        if (!isMounted) return;

        setResults(allResults);
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
