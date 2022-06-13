import { clients } from '@/graphql/client';
import {
  BadgesForUserDocument,
  BadgesForUserQuery,
  BadgesForUserQueryVariables,
} from '@/graphql/types';

export type UserBadges = {
  tokens: {
    name?: string | null | undefined;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
  }[];
  chainId: string;
};

export const getBadgesForUser = async (
  chainId: string,
  address: string,
): Promise<UserBadges | null> => {
  const { data, error } = await clients[chainId]
    .query<BadgesForUserQuery, BadgesForUserQueryVariables>(
      BadgesForUserDocument,
      {
        address: address.toLowerCase(),
      },
    )
    .toPromise();
  if (!data?.user) {
    if (error) {
      throw error;
    }
    return null;
  }

  const {
    user: { tokens },
  } = data;

  return {
    chainId,
    tokens,
  };
};
