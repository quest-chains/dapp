import { client } from '@/graphql/client';
import {
  QuestChainAddressesDocument,
  QuestChainAddressesQuery,
  QuestChainAddressesQueryVariables,
  QuestChainInfoDocument,
  QuestChainInfoFragment,
  QuestChainInfoQuery,
  QuestChainInfoQueryVariables,
} from '@/graphql/types';

export const getQuestChainAddresses = async (limit = 1000) => {
  const { data, error } = await client
    .query<QuestChainAddressesQuery, QuestChainAddressesQueryVariables>(
      QuestChainAddressesDocument,
      {
        limit,
      },
    )
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }
    return [];
  }
  return data.questChains.map(a => a.address);
};

export const getQuestChainInfo = async (
  address: string,
): Promise<QuestChainInfoFragment | null> => {
  const { data, error } = await client
    .query<QuestChainInfoQuery, QuestChainInfoQueryVariables>(
      QuestChainInfoDocument,
      {
        address,
      },
    )
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }
    return null;
  }
  return data.questChain ?? null;
};
