import { useEffect, useState } from 'react';

import { getStatusForUser, UserStatus } from '@/graphql/statusForUser';
import { NETWORK_INFO, useWallet } from '@/web3';

const chainIds = Object.keys(NETWORK_INFO);

export const useUserProgressForAllChains = (): {
  error: unknown;
  fetching: boolean;
  results: UserStatus[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<UserStatus[]>([]);

  const { address } = useWallet();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          chainIds.map(async chainId =>
            getStatusForUser(chainId, address ?? ''),
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
