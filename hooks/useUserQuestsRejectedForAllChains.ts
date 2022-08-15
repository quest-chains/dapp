import { useEffect, useState } from 'react';

import { getQuestsRejectedForUserAndChain } from '@/graphql/questStatuses';
import { QuestStatusInfoFragment } from '@/graphql/types';
import { SUPPORTED_NETWORKS } from '@/utils/constants';

import { useRefresh } from './useRefresh';

export const useUserQuestsRejectedForAllChains = (
  address: string | undefined | null,
): {
  error: unknown;
  fetching: boolean;
  results: QuestStatusInfoFragment[];
  refresh: () => void;
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<QuestStatusInfoFragment[]>([]);
  const [refreshCount, refresh] = useRefresh();

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
            getQuestsRejectedForUserAndChain(chainId, address ?? ''),
          ),
        );
        if (!isMounted) return;

        setResults(allResults.flat());
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
  }, [refreshCount, address]);

  return {
    fetching,
    error,
    results,
    refresh,
  };
};
