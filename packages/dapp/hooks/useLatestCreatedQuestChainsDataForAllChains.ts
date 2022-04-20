import { useEffect, useState } from 'react';

import { getCreatedQuestChains } from '@/graphql/questChains';
import { QuestChainInfoFragment } from '@/graphql/types';
import { NETWORK_INFO, useWallet } from '@/web3';

const chainIds = Object.keys(NETWORK_INFO);

import { useRefresh } from './useRefresh';

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
          chainIds.map(async chainId =>
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
