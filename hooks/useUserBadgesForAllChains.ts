import { useEffect, useState } from 'react';

import { getBadgesForUser, UserBadges } from '@/graphql/badgesForUser';
import { SUPPORTED_NETWORKS } from '@/utils/constants';

export const useUserBadgesForAllChains = (
  address: string,
): {
  error: unknown;
  fetching: boolean;
  results: (UserBadges | undefined | null)[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<(UserBadges | undefined | null)[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
            getBadgesForUser(chainId, address ?? ''),
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
