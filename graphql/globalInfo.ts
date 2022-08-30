import { clients } from '@/graphql/client';
import {
  GlobalInfoDocument,
  GlobalInfoFragment,
  GlobalInfoQuery,
  GlobalInfoQueryVariables,
} from '@/graphql/types';
import { SUPPORTED_NETWORK_INFO } from '@/web3';

export const getChainInfo = async (
  chainId: string,
): Promise<GlobalInfoFragment | null> => {
  const { data, error } = await clients[chainId]
    .query<GlobalInfoQuery, GlobalInfoQueryVariables>(GlobalInfoDocument)
    .toPromise();
  if (!data || !data.globals.length || data.globals[0].chainId !== chainId) {
    if (error) {
      throw error;
    }
    return null;
  }

  return data.globals[0];
};

export const getGlobalInfo = async (): Promise<
  Record<string, GlobalInfoFragment>
> => {
  const globalInfo: Record<string, GlobalInfoFragment> = {};

  await Promise.all(
    Object.keys(SUPPORTED_NETWORK_INFO).map(async chainId => {
      const info = await getChainInfo(chainId);
      if (info !== null) {
        globalInfo[chainId] = info;
      }
    }),
  );

  return globalInfo;
};
