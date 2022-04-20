import { useEffect, useState } from 'react';

import { getQuestChainInfo } from '@/graphql/questChains';
import { QuestChainInfoFragment } from '@/graphql/types';

import { useRefresh } from './useRefresh';

export const useLatestQuestChainData = (
  inputQuestChain: QuestChainInfoFragment | null,
): {
  questChain: QuestChainInfoFragment | null;
  refresh: () => void;
  fetching: boolean;
  error: unknown;
} => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [questChain, setQuestChain] = useState<QuestChainInfoFragment | null>(
    inputQuestChain,
  );

  const [refreshCount, refresh] = useRefresh();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!inputQuestChain?.chainId || !inputQuestChain?.address) return;
      try {
        setFetching(true);
        const data = await getQuestChainInfo(
          inputQuestChain.chainId,
          inputQuestChain.address,
        );
        if (!isMounted) return;
        setQuestChain(data);
      } catch (err) {
        setError(err);
        setQuestChain(inputQuestChain);
      } finally {
        setFetching(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [refreshCount, inputQuestChain]);

  return {
    questChain,
    fetching,
    error,
    refresh,
  };
};
