import { Spinner, Text } from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { Page } from '@/components/Layout/Page';
import { QuestChainV0Page } from '@/components/QuestChain/QuestChainV0Page';
import { HeadComponent } from '@/components/Seo';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { QUESTCHAINS_URL, SUPPORTED_NETWORKS } from '@/utils/constants';

const { getQuestChainAddresses, getQuestChainInfo, getStatusesForChain } =
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

  if (isFallback) {
    return (
      <Page>
        <Spinner color="main" />
      </Page>
    );
  }
  if (!questChain) {
    return (
      <Page>
        <HeadComponent
          title={'Quest Chain Not Found'}
          description={'This quest chain does not exist'}
          url={QUESTCHAINS_URL}
        />
        <Text> Quest chain not found! </Text>
      </Page>
    );
  }

  // if (questChain.version === '0') {
  //   return (
  //     <QuestChainV0Page
  //       {...{
  //         questChain,
  //         questStatuses,
  //         fetching,
  //         refresh,
  //       }}
  //     />
  //   );
  // }

  return (
    <QuestChainV0Page {...{ questChain, questStatuses, fetching, refresh }} />
  );
};

type QueryParams = { address: string; chainId: string };

export async function getStaticPaths() {
  const paths: { params: QueryParams }[] = [];

  await Promise.all(
    SUPPORTED_NETWORKS.map(async chainId => {
      const addresses = await getQuestChainAddresses(chainId, 1000);

      paths.push(
        ...addresses.map(address => ({
          params: { address, chainId },
        })),
      );
    }),
  );

  return { paths, fallback: true };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const address = context.params?.address;
  const chainId = context.params?.chainId;

  let questStatuses: graphql.QuestStatusInfoFragment[] = [];

  let questChain = null;
  if (address && chainId) {
    try {
      questStatuses = address
        ? await getStatusesForChain(chainId, address)
        : [];
      questChain = address ? await getQuestChainInfo(chainId, address) : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `Could not fetch quest chain for address ${address}`,
        error,
      );
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
