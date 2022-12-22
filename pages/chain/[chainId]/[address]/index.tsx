import { Spinner, Text } from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { ethers } from 'ethers';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';

import { Page } from '@/components/Layout/Page';
import { QuestChainV0Page } from '@/components/QuestChain/QuestChainV0Page';
import { QuestChainV1Page } from '@/components/QuestChain/QuestChainV1Page';
import { HeadComponent } from '@/components/Seo';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { QUESTCHAINS_URL, SUPPORTED_NETWORKS } from '@/utils/constants';
import { CHAIN_URL_MAPPINGS } from '@/web3/networks';

const {
  getQuestChainAddresses,
  getQuestChainsFromSlug,
  getStatusesForChain,
  getQuestChainInfo,
} = graphql;

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
    <QuestChainV1Page {...{ questChain, questStatuses, fetching, refresh }} />
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
  let chainId = context.params?.chainId;
  const address = context.params?.address;

  let questStatuses: graphql.QuestStatusInfoFragment[] = [];

  let questChain = null;

  if (chainId && CHAIN_URL_MAPPINGS[chainId]) {
    chainId = CHAIN_URL_MAPPINGS[chainId];
  }

  if (address && chainId) {
    if (ethers.utils.isAddress(address)) {
      try {
        questStatuses = address
          ? await getStatusesForChain(chainId, address)
          : [];
        questChain = address ? await getQuestChainInfo(chainId, address) : null;
      } catch (error) {
        // eslint-disable-next-line no-console
      }
    } else {
      try {
        const questChainsFromSlug = address
          ? await getQuestChainsFromSlug(chainId, address)
          : null;

        questChain = questChainsFromSlug ? questChainsFromSlug[0] : null;
        if (questChain) {
          questStatuses = await getStatusesForChain(
            chainId,
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
