import { client } from '@/graphql/client';
import {
  QuestStatusInfoFragment,
  StatusForChainDocument,
  StatusForChainQuery,
  StatusForChainQueryVariables,
} from '@/graphql/types';

export const getStatusesForChain = async (
  address: string,
): Promise<QuestStatusInfoFragment[]> => {
  const { data, error } = await client
    .query<StatusForChainQuery, StatusForChainQueryVariables>(
      StatusForChainDocument,
      {
        address: address.toLowerCase(),
        first: 1000,
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
