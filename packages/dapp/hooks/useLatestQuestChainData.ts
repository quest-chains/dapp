import { useMemo } from 'react';
import { CombinedError } from 'urql';

import {
  QuestChainInfoFragment,
  useQuestChainInfoQuery,
} from '@/graphql/types';

export const useLatestQuestChainData = (
  inputQuestChain: QuestChainInfoFragment | null,
): {
  questChain: QuestChainInfoFragment | null;
  refresh: () => void;
  fetching: boolean;
  error: CombinedError | undefined;
} => {
  const [{ data, fetching, error }, execute] = useQuestChainInfoQuery({
    variables: { address: inputQuestChain?.address ?? '' },
    requestPolicy: 'network-only',
    pause: !!inputQuestChain,
  });
  const questChain = useMemo(
    () => (!fetching && data?.questChain ? data.questChain : inputQuestChain),
    [data, fetching, inputQuestChain],
  );

  return {
    questChain,
    fetching,
    refresh: execute,
    error,
  };
};
