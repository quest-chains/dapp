import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/web3/networks';

import { useRefresh } from './useRefresh';

export type UserNFTStatus = {
  questChain: graphql.QuestChainInfoFragment;
  completed: number;
};

export const useNFTsToMintForAllChains = (
  address: string | undefined | null,
): {
  error: unknown;
  fetching: boolean;
  results: UserNFTStatus[];
  refresh: () => void;
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<UserNFTStatus[]>([]);
  const [refreshCount, refresh] = useRefresh();

  useEffect(() => {
    if (!address) {
      setFetching(false);
      setError(new Error('No address provider'));
      setResults([]);
      return;
    }
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        const allResults = await Promise.all(
          SUPPORTED_NETWORKS.map(async chainId =>
            graphql.getStatusForUser(chainId, address ?? ''),
          ),
        );
        if (!isMounted) return;

        setResults(
          allResults
            .reduce((t, a) => {
              // add results from all chains to single array
              t.push(...a);
              return t;
            }, [])
            .filter(us => {
              // filter out quest chains for which nft is not mintable
              const questChain = us.chain;

              if (
                questChain.token.owners
                  .map(o => o.id)
                  .includes(address?.toLowerCase())
              )
                return false;

              let atLeastOnePassed = false;

              const userStatus: Record<string, graphql.Status> = {};
              us.questStatuses.forEach(({ quest, status }) => {
                userStatus[quest.questId] = status;
              });

              for (let i = 0; i < questChain.quests.length; ++i) {
                const quest = questChain.quests[i];
                const status = userStatus[quest.questId];

                if (
                  !(
                    quest.optional ||
                    quest.paused ||
                    status === graphql.Status.Pass
                  )
                )
                  return false;

                if (!atLeastOnePassed && status === graphql.Status.Pass)
                  atLeastOnePassed = true;
              }

              return atLeastOnePassed;
            })
            .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt))
            .map(us => ({
              questChain: us.chain,
              completed: us.completed,
            })),
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
    fetching,
    error,
    results,
    refresh,
  };
};
