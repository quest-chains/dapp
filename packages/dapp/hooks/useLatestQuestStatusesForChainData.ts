import { useEffect, useState } from 'react';

import { getStatusesForChain } from '@/graphql/questStatuses';
import { QuestStatusInfoFragment } from '@/graphql/types';

import { useRefresh } from './useRefresh';

export const useLatestQuestStatusesForChainData = (
  chainId: string | undefined | null,
  chain: string | undefined | null,
  inputQuestStatuses: QuestStatusInfoFragment[],
): {
  questStatuses: QuestStatusInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: unknown;
} => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [questStatuses, setQuestStatuses] =
    useState<QuestStatusInfoFragment[]>(inputQuestStatuses);

  const [refreshCount, refresh] = useRefresh();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!chainId || !chain) return;
      try {
        setFetching(true);
        const data = await getStatusesForChain(chainId, chain);
        if (!isMounted) return;
        setQuestStatuses(data);
      } catch (err) {
        setError(err);
        setQuestStatuses(inputQuestStatuses);
      } finally {
        setFetching(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [refreshCount, chainId, chain, inputQuestStatuses]);

  return {
    questStatuses,
    fetching,
    error,
    refresh,
  };
};
