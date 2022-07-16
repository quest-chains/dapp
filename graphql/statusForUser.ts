import { clients } from '@/graphql/client';
import {
  QuestChainInfoFragment,
  QuestStatusInfoFragment,
  StatusForUserDocument,
  StatusForUserQuery,
  StatusForUserQueryVariables,
} from '@/graphql/types';

export type UserStatus = {
  chain: QuestChainInfoFragment;
  updatedAt: Date;
  completed: number;
  total: number;
};

export const getStatusForUser = async (
  chainId: string,
  address: string,
): Promise<UserStatus[]> => {
  const { data, error } = await clients[chainId]
    .query<StatusForUserQuery, StatusForUserQueryVariables>(
      StatusForUserDocument,
      {
        user: address.toLowerCase(),
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

  const statuses: Record<string, QuestStatusInfoFragment[]> = {};
  data.questStatuses.forEach(qs => {
    const arr = statuses[qs.questChain.address] ?? [];
    statuses[qs.questChain.address] = [...arr, qs];
  });

  return Object.values(statuses)
    .filter(value => value.length !== 0)
    .map(value => {
      const chain = value[0].questChain;
      const total = chain.quests.filter(q => !q.paused).length;
      const completed = value
        .filter(a => !a.quest.paused)
        .reduce((t, a) => t + (a.status === 'pass' ? 1 : 0), 0);
      const updatedAt = value
        .filter(a => !a.quest.paused)
        .reduce((t, a) => (t > a.updatedAt ? t : a.updatedAt), '0');
      return { chain, completed, total, updatedAt: new Date(updatedAt) };
    });
};
