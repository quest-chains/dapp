import { useEffect, useState } from 'react';

import { getCreatedQuestChains } from '@/graphql/questChains';
import { QuestChainInfoFragment } from '@/graphql/types';
import { useRefresh } from '@/hooks/useRefresh';
import { SUPPORTED_NETWORKS } from '@/utils/constants';
import { useWallet } from '@/web3';

export const useLatestCreatedQuestChainsDataForAllChains = (): {
  questChains: QuestChainInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: unknown;
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<QuestChainInfoFragment[]>([]);

  const { address } = useWallet();
  const [refreshCount, refresh] = useRefresh();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!address) return;
      try {
        setFetching(true);
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
            getCreatedQuestChains(chainId, address),
          ),
        );
        if (!isMounted) return;

        setResults(
          allResults
            .reduce((t, a) => {
              t.push(...a);
              return t;
            }, [])
            .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt)),
        );
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
  }, [address, refreshCount]);

  return {
    questChains: results,
    fetching,
    refresh,
    error,
  };
};
