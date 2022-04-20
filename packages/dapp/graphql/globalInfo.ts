import { clients } from '@/graphql/client';
import {
  GlobalInfoDocument,
  GlobalInfoQuery,
  GlobalInfoQueryVariables,
} from '@/graphql/types';
import { NETWORK_INFO } from '@/web3';

export const getFactoryAddress = async (
  chainId: string,
): Promise<string | null> => {
  const { data, error } = await clients[chainId]
    .query<GlobalInfoQuery, GlobalInfoQueryVariables>(GlobalInfoDocument)
    .toPromise();
  if (!data || !data.globals.length || data.globals[0].chainId !== chainId) {
    if (error) {
      throw error;
    }
    return null;
  }
  return data.globals[0].factoryAddress;
};

export const getGlobalInfo = async (): Promise<Record<string, string>> => {
  const globalInfo: Record<string, string> = {};

  await Promise.all(
    Object.keys(NETWORK_INFO).map(async chainId => {
      const address = await getFactoryAddress(chainId);
      if (address) {
        globalInfo[chainId] = address;
      }
    }),
  );

  return globalInfo;
};
