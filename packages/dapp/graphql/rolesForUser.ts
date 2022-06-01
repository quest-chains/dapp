import { clients } from '@/graphql/client';
import {
  QuestChainInfoFragment,
  RolesForUserDocument,
  RolesForUserQuery,
  RolesForUserQueryVariables,
} from '@/graphql/types';

export type UserRoles = {
  adminOf?: QuestChainInfoFragment[];
  editorOf?: QuestChainInfoFragment[];
  reviewerOf?: QuestChainInfoFragment[];
  chainId: string;
};

export const getRolesForUser = async (
  chainId: string,
  address: string,
): Promise<UserRoles | undefined | null> => {
  const { data, error } = await clients[chainId]
    .query<RolesForUserQuery, RolesForUserQueryVariables>(
      RolesForUserDocument,
      {
        address: address.toLowerCase(),
      },
    )
    .toPromise();
  if (!data) {
    if (error) {
      throw error;
    }
    return undefined;
  }

  const { user } = data;

  return {
    chainId,
    ...user,
  };
};
