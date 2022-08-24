import { clients } from '@/graphql/client';
import {
  GlobalInfoDocument,
  GlobalInfoQuery,
  GlobalInfoQueryVariables,
} from '@/graphql/types';
import { SUPPORTED_NETWORK_INFO } from '@/web3';

export const getChainInfo = async (
  chainId: string,
): Promise<{
  factoryAddress: string;
  tokenAddress: string;
  paymentTokenAddress: string;
  upgradeFee: number;
} | null> => {
  const { data, error } = await clients[chainId]
    .query<GlobalInfoQuery, GlobalInfoQueryVariables>(GlobalInfoDocument)
    .toPromise();
  if (!data || !data.globals.length || data.globals[0].chainId !== chainId) {
    if (error) {
      throw error;
    }
    return null;
  }

  const { factoryAddress, tokenAddress, paymentTokenAddress, upgradeFee } =
    data.globals[0];

  return {
    factoryAddress,
    tokenAddress,
    paymentTokenAddress,
    upgradeFee,
  };
};

export const getGlobalInfo = async (): Promise<
  Record<
    string,
    {
      factoryAddress: string;
      tokenAddress: string;
      paymentTokenAddress: string;
      upgradeFee: number;
    }
  >
> => {
  const globalInfo: Record<
    string,
    {
      factoryAddress: string;
      tokenAddress: string;
      paymentTokenAddress: string;
      upgradeFee: number;
    }
  > = {};

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
