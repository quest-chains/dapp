import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { useRefresh } from './useRefresh';

export const useLatestQuestStatusesForChainData = (
  chainId: string | undefined | null,
  chain: string | undefined | null,
  inputQuestStatuses: graphql.QuestStatusInfoFragment[],
): {
  questStatuses: graphql.QuestStatusInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: unknown;
} => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [questStatuses, setQuestStatuses] =
    useState<graphql.QuestStatusInfoFragment[]>(inputQuestStatuses);

  const [refreshCount, refresh] = useRefresh();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!chainId || !chain) return;
      try {
        setFetching(true);
        const data = await graphql.getStatusesForChain(chainId, chain);
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
