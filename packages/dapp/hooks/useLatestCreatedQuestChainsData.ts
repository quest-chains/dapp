import { useMemo } from 'react';
import { CombinedError } from 'urql';

import {
  QuestChainInfoFragment,
  useCreatedQuestChainsInfoQuery,
} from '@/graphql/types';
import { useWallet } from '@/web3';

export const useLatestCreatedQuestChainsData = (): {
  questChains: QuestChainInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: CombinedError | undefined;
} => {
  const { address } = useWallet();
  const [{ data, fetching, error }, execute] = useCreatedQuestChainsInfoQuery({
    variables: { user: (address ?? '').toLowerCase(), limit: 1000 },
    requestPolicy: 'network-only',
    pause: !address,
  });
  const questChains: QuestChainInfoFragment[] = useMemo(
    () => (data?.questChains ? data.questChains : []),
    [data],
  );

  return {
    questChains,
    fetching,
    refresh: execute,
    error,
  };
};
