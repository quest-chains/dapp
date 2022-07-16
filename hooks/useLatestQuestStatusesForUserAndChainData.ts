import { useEffect, useState } from 'react';

import { getStatusesForUserAndChain } from '@/graphql/questStatuses';
import { QuestStatusInfoFragment } from '@/graphql/types';

import { useRefresh } from './useRefresh';

export const useLatestQuestStatusesForUserAndChainData = (
  chainId: string | undefined | null,
  chain: string | undefined | null,
  user: string | undefined | null,
): {
  questStatuses: QuestStatusInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: unknown;
} => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [questStatuses, setQuestStatuses] = useState<QuestStatusInfoFragment[]>(
    [],
  );

  const [refreshCount, refresh] = useRefresh();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!chainId || !chain || !user) return;
      try {
        setFetching(true);
        const data = await getStatusesForUserAndChain(chainId, chain, user);
        if (!isMounted) return;
        setQuestStatuses(data);
      } catch (err) {
        setError(err);
        setQuestStatuses([]);
      } finally {
        setFetching(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [refreshCount, chainId, chain, user]);

  return {
    questStatuses,
    fetching,
    error,
    refresh,
  };
};
