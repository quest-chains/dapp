import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { Network, NetworkDevelopment } from '@/components/Explore/QuestChains';
import { SUPPORTED_NETWORKS } from '@/utils/constants';
import { CHAIN_URL_MAPPINGS } from '@/web3/networks';

export const useFilteredQuestChains = (
  filters: graphql.QuestChainFiltersInfo,
  networks: Record<Network | NetworkDevelopment, boolean>,
): {
  error: unknown;
  fetching: boolean;
  results: graphql.QuestChainInfoFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<graphql.QuestChainInfoFragment[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        let chains: graphql.QuestChainInfoFragment[] = [];
        const n = Object.keys(networks)
          .filter(key => networks[key as Network])
          .map(n => CHAIN_URL_MAPPINGS[n.toLowerCase()]);

        if (n.length > 0) {
          const allResults = await Promise.all(
            n.map(async n => graphql.getQuestChainsFromFilters(n, filters)),
          );
          chains = allResults.reduce((t, a) => {
            t.push(...a);
            return t;
          }, []);
        } else {
          const allResults = await Promise.all(
            SUPPORTED_NETWORKS.map(async n =>
              graphql.getQuestChainsFromFilters(n, filters),
            ),
          );
          chains = allResults.reduce((t, a) => {
            t.push(...a);
            return t;
          }, []);
        }

        if (!isMounted) return;

        setResults(chains);
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
  }, [filters, networks]);

  return {
    fetching,
    error,
    results,
  };
};
