import { useMemo } from 'react';
import { CombinedError } from 'urql';

import {
  QuestStatusInfoFragment,
  useStatusForUserAndChainQuery,
} from '@/graphql/types';

export const useLatestQuestStatusesForUserAndChainData = (
  chain: string | undefined | null,
  user: string | undefined | null,
  inputQuestStatuses: QuestStatusInfoFragment[],
): {
  questStatuses: QuestStatusInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: CombinedError | undefined;
} => {
  const [{ data, fetching, error }, execute] = useStatusForUserAndChainQuery({
    variables: {
      address: (chain ?? '').toLowerCase(),
      user: (user ?? '').toLowerCase(),
    },
    requestPolicy: 'network-only',
    pause: !user || !chain,
  });
  const questStatuses = useMemo(
    () => (data?.questStatuses ? data.questStatuses : inputQuestStatuses),
    [data, inputQuestStatuses],
  );

  return {
    questStatuses,
    fetching,
    refresh: execute,
    error,
  };
};
