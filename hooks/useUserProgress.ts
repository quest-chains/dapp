import { graphql } from '@quest-chains/sdk';
import { useMemo } from 'react';

import { UserStatusType } from './useUserStatus';

type UserProgresstype = {
  progress: {
    total: number;
    inReviewCount: number;
    completeCount: number;
  };
  canMint: boolean;
};

export const useUserProgress = (
  address: string | undefined | null,
  questChain: graphql.QuestChainInfoFragment | null,
  userStatus: UserStatusType,
): UserProgresstype => {
  const progress = useMemo(() => {
    if (!questChain?.quests)
      return {
        total: 0,
        inReviewCount: 0,
        completeCount: 0,
      };
    const inReviewCount = questChain.quests.filter(
      quest =>
        !quest.paused &&
        userStatus[quest.questId]?.status === graphql.Status.Review,
    ).length;
    const completeCount = questChain.quests.filter(
      quest =>
        !quest.paused &&
        userStatus[quest.questId]?.status === graphql.Status.Pass,
    ).length;

    return {
      inReviewCount: inReviewCount || 0,
      completeCount: completeCount || 0,
      total: questChain.quests.filter(q => !q.paused).length || 0,
    };
  }, [questChain, userStatus]);

  const canMint = useMemo(() => {
    if (!address) return false;
    if (!questChain?.token) return false;
    if (questChain.token.owners.find(o => o.id === address.toLowerCase()))
      return false;

    let atLeastOnePassed = false;

    for (let i = 0; i < questChain.quests.length; ++i) {
      const quest = questChain.quests[i];
      const status = userStatus[quest.questId]?.status;

      if (!(quest.optional || quest.paused || status === graphql.Status.Pass))
        return false;

      if (!atLeastOnePassed && status === graphql.Status.Pass)
        atLeastOnePassed = true;
    }

    return atLeastOnePassed;
  }, [questChain, address, userStatus]);

  return { progress, canMint };
};
