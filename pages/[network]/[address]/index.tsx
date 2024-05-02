import { Heading } from '@chakra-ui/react';
import { isAddress } from '@ethersproject/address';
import { graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { Page } from '@/components/Layout/Page';
import { LoadingState } from '@/components/LoadingState';
import { QuestChainV0Page } from '@/components/QuestChain/QuestChainV0Page';
import { QuestChainV2Page } from '@/components/QuestChain/QuestChainV2Page';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { CHAIN_URL_MAPPINGS } from '@/web3/networks';

const { getQuestChainFromSlug, getStatusesForChain, getQuestChainInfo } =
  graphql;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

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

const QuestChainPage: React.FC<Props> = ({
  questChain: inputQuestChain,
  questStatuses: inputQuestStatuses,
}) => {
  const { isFallback } = useRouter();

  const {
    questChain,
    fetching: fetchingQuests,
    refresh: refreshQuests,
  } = useLatestQuestChainData(inputQuestChain);

  const {
    questStatuses,
    fetching: fetchingStatus,
    refresh: refreshStatus,
  } = useLatestQuestStatusesForChainData(
    questChain?.chainId,
    questChain?.address,
    inputQuestStatuses,
  );

  const fetching = fetchingStatus || fetchingQuests;

  const refresh = useCallback(() => {
    refreshStatus();
    refreshQuests();
  }, [refreshQuests, refreshStatus]);

  if (isFallback || fetching || (!questChain && !!inputQuestChain)) {
    return (
      <Page align="center">
        <LoadingState my={20} />
      </Page>
    );
  }
  if (!questChain) {
    return (
      <Page align="center">
        <Heading fontSize={36}>Quest chain not found!</Heading>
      </Page>
    );
  }

  if (questChain.version === '0') {
    return (
      <QuestChainV0Page
        {...{
          questChain,
          questStatuses,
          fetching,
          refresh,
        }}
      />
    );
  }

  return (
    <QuestChainV2Page {...{ questChain, questStatuses, fetching, refresh }} />
  );
};

type QueryParams = { address: string; network: string };

export async function getStaticPaths() {
  const paths: { params: QueryParams }[] = [];

  // await Promise.all(
  //   SUPPORTED_NETWORKS.map(async chainId => {
  //     const addresses = await getQuestChainAddresses(chainId, 1000);
  //
  //     paths.push(
  //       ...addresses.map(address => ({
  //         params: { address, network: AVAILABLE_NETWORK_INFO[chainId].urlName },
  //       })),
  //     );
  //   }),
  // );

  return { paths, fallback: true };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  let network = context.params?.network;
  const address = context.params?.address;

  let questStatuses: graphql.QuestStatusInfoFragment[] = [];
  let questChain = null;

  if (network && CHAIN_URL_MAPPINGS[network]) {
    network = CHAIN_URL_MAPPINGS[network];
  }

  if (address && network) {
    if (isAddress(address)) {
      try {
        questStatuses = await getStatusesForChain(network, address);
        questChain = await getQuestChainInfo(network, address);
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    } else {
      try {
        questChain = await getQuestChainFromSlug(network, address);

        if (questChain) {
          questStatuses = await getStatusesForChain(
            network,
            questChain.address,
          );
        }
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    }
  }

  return {
    props: {
      questChain,
      questStatuses,
    },
    revalidate: 60,
  };
};

export default QuestChainPage;
