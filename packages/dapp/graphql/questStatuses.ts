import { clients } from '@/graphql/client';
import {
  QuestsRejectedDocument,
  QuestsRejectedQuery,
  QuestsRejectedQueryVariables,
  QuestStatusInfoFragment,
  StatusForChainDocument,
  StatusForChainQuery,
  StatusForChainQueryVariables,
  StatusForUserAndChainDocument,
  StatusForUserAndChainQuery,
  StatusForUserAndChainQueryVariables,
} from '@/graphql/types';

export const getStatusesForChain = async (
  chainId: string,
  chain: string,
): Promise<QuestStatusInfoFragment[]> => {
  const { data, error } = await clients[chainId]
    .query<StatusForChainQuery, StatusForChainQueryVariables>(
      StatusForChainDocument,
      {
        address: chain.toLowerCase(),
        limit: 1000,
      },
    )
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }
    return [];
  }
  return data.questStatuses;
};

export const getStatusesForUserAndChain = async (
  chainId: string,
  chain: string,
  user: string,
): Promise<QuestStatusInfoFragment[]> => {
  const { data, error } = await clients[chainId]
    .query<StatusForUserAndChainQuery, StatusForUserAndChainQueryVariables>(
      StatusForUserAndChainDocument,
      {
        address: chain.toLowerCase(),
        user: user.toLowerCase(),
        limit: 1000,
      },
    )
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }
    return [];
  }
  return data.questStatuses;
};

export const getQuestsRejectedForUserAndChain = async (
  chainId: string,
  address: string,
): Promise<QuestStatusInfoFragment[]> => {
  const { data, error } = await clients[chainId]
    .query<QuestsRejectedQuery, QuestsRejectedQueryVariables>(
      QuestsRejectedDocument,
      {
        address: address.toLowerCase(),
      },
    )
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }
    return [];
  }

  return data.user?.questsFailed || [];
};
