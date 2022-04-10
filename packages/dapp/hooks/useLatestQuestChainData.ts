import { useEffect, useMemo } from 'react';

import {
  QuestChainInfoFragment,
  useQuestChainInfoQuery,
} from '@/graphql/types';
import { useRefresh } from '@/hooks/useRefresh';

export const useLatestQuestChainData = (
  inputQuestChain: QuestChainInfoFragment | null,
): {
  questChain: QuestChainInfoFragment | null;
  refresh: () => void;
  fetching: boolean;
} => {
  const [{ data, fetching }, execute] = useQuestChainInfoQuery({
    variables: { address: inputQuestChain?.address ?? '' },
    requestPolicy: 'network-only',
    pause: !!inputQuestChain,
  });
  const questChain = useMemo(
    () => (!fetching && data?.questChain ? data.questChain : inputQuestChain),
    [data, fetching, inputQuestChain],
  );

  const [refreshCount, refresh] = useRefresh();
  useEffect(() => {
    execute();
  }, [refreshCount, execute]);

  return {
    questChain,
    fetching,
    refresh,
  };
};
