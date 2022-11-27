import { graphql } from '@quest-chains/sdk';
import { useMemo } from 'react';

export type UserStatusType = {
  [questId: string]: {
    submissions: {
      description: string | undefined | null;
      externalUrl: string | undefined | null;
      timestamp: string;
    }[];
    reviews: {
      description: string | undefined | null;
      externalUrl: string | undefined | null;
      timestamp: string;
      reviewer: string;
      accepted: boolean;
    }[];
    status: graphql.Status;
  };
};

export const useUserStatus = (
  questStatuses: graphql.QuestStatusInfoFragment[],
  address: string,
): UserStatusType => {
  const userStatus: UserStatusType = useMemo(() => {
    const userStat: UserStatusType = {};
    questStatuses
      .filter(item => item.user.id === address.toLowerCase())
      .forEach(item => {
        userStat[item.quest.questId] = {
          status: item.status,
          submissions: item.submissions.map(sub => ({
            description: sub.description,
            externalUrl: sub.externalUrl,
            timestamp: sub.timestamp,
          })),
          reviews: item.reviews.map(sub => ({
            description: sub.description,
            externalUrl: sub.externalUrl,
            timestamp: sub.timestamp,
            accepted: sub.accepted,
            reviewer: sub.reviewer.id,
          })),
        };
      });
    return userStat;
  }, [questStatuses, address]);

  return userStatus;
};
