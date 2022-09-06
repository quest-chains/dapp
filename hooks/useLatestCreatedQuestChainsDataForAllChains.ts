import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { useRefresh } from '@/hooks/useRefresh';
import { SUPPORTED_NETWORKS } from '@/utils/constants';
import { useWallet } from '@/web3';

export const useLatestCreatedQuestChainsDataForAllChains = (): {
  questChains: graphql.QuestChainInfoFragment[];
  refresh: () => void;
  fetching: boolean;
  error: unknown;
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<graphql.QuestChainInfoFragment[]>([]);

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
            graphql.getCreatedQuestChains(chainId, address),
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
