import { useEffect, useState } from 'react';

import { getStatusForUser } from '@/graphql/statusForUser';
import { SUPPORTED_NETWORKS } from '@/utils/constants';

import { useRefresh } from './useRefresh';

export type UserNFTStatus = {
  address: string;
  chainId: string;
  name?: string | null | undefined;
  completed: number;
};

export const useNFTsToMintForAllChains = (
  address: string,
): {
  error: unknown;
  fetching: boolean;
  results: UserNFTStatus[];
  refresh: () => void;
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<UserNFTStatus[]>([]);
  const [refreshCount, refresh] = useRefresh();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
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
            .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
            .filter(
              us =>
                us.completed > 0 &&
                us.completed === us.total &&
                !us.chain.token.owners
                  .map(o => o.id)
                  .includes(address?.toLowerCase()),
            )
            .map(us => ({
              chainId: us.chain.chainId,
              address: us.chain.address,
              completed: us.completed,
              name: us.chain.name,
            })),
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
  }, [address, refreshCount]);

  return {
    fetching,
    error,
    results,
    refresh,
  };
};
