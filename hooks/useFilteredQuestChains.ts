import { graphql } from '@quest-chains/sdk';
import { useEffect, useState } from 'react';

import { SUPPORTED_NETWORKS } from '@/web3/networks';

const { OrderDirection, QuestChain_OrderBy } = graphql;

const getSortKey = (
  orderBy: graphql.QuestChain_OrderBy = QuestChain_OrderBy.UpdatedAt,
): keyof graphql.QuestChainDisplayFragment => {
  switch (orderBy) {
    case QuestChain_OrderBy.NumCompletedQuesters:
      return 'numCompletedQuesters';
    case QuestChain_OrderBy.QuestCount:
      return 'numQuests';
    case QuestChain_OrderBy.UpdatedAt:
    default:
      return 'updatedAt';
  }
};

export const useFilteredQuestChains = (
  filters: graphql.QuestChainFiltersInfo,
  networks: Record<string, boolean> = {},
): {
  error: unknown;
  fetching: boolean;
  results: graphql.QuestChainDisplayFragment[];
} => {
  const [error, setError] = useState<unknown>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [results, setResults] = useState<graphql.QuestChainDisplayFragment[]>(
    [],
  );

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setFetching(true);
        let chains: graphql.QuestChainDisplayFragment[] = [];
        const n = Object.entries(networks)
          .filter(([_, value]) => value)
          .map(([key]) => key);

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

        const sortKey = getSortKey(filters.orderBy);
        const sortValue =
          filters.orderDirection === OrderDirection.Asc ? 1 : -1;

        chains = chains.sort((a, b) =>
          a[sortKey] > b[sortKey] ? sortValue : -1 * sortValue,
        );

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
