import { useEffect, useState } from 'react';

import { getRolesForUser, UserRoles } from '@/graphql/rolesForUser';
import { NETWORK_INFO } from '@/web3';

const chainIds = Object.keys(NETWORK_INFO);

export const useUserRolesForAllChains = (
  address: string,
): {
  error: unknown;
  fetching: boolean;
  results: (UserRoles | undefined | null)[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<(UserRoles | undefined | null)[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          chainIds.map(async chainId =>
            getRolesForUser(chainId, address ?? ''),
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
