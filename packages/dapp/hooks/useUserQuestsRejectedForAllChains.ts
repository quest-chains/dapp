import { useEffect, useState } from 'react';

import { getQuestsRejectedForUserAndChain } from '@/graphql/questStatuses';
import { QuestStatusInfoFragment } from '@/graphql/types';
import { NETWORK_INFO } from '@/web3';

const chainIds = Object.keys(NETWORK_INFO);

export const useUserQuestsRejectedForAllChains = (
  address: string,
): {
  error: unknown;
  fetching: boolean;
  results: QuestStatusInfoFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<QuestStatusInfoFragment[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          chainIds.map(async chainId =>
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
  }, [address]);

  return {
    fetching,
    error,
    results,
  };
};
