import { useMemo } from 'react';
import { CombinedError } from 'urql';

import {
  QuestStatusInfoFragment,
  useStatusForChainQuery,
} from '@/graphql/types';

export const useLatestQuestStatusesForChainData = (
  address: string | undefined | null,
  inputQuestStatuses: QuestStatusInfoFragment[],
): {
  questStatuses: QuestStatusInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: CombinedError | undefined;
} => {
  const [{ data, fetching, error }, execute] = useStatusForChainQuery({
    variables: { address: (address ?? '').toLowerCase(), first: 1000 },
    requestPolicy: 'network-only',
    pause: !address,
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
