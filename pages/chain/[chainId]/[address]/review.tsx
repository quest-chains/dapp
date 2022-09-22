import { Spinner, Text, VStack } from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { QuestChainV0ReviewPage } from '@/components/Review/QuestChainV0ReviewPage';
import { QuestChainV1ReviewPage } from '@/components/Review/QuestChainV1ReviewPage';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';

const { getQuestChainAddresses, getQuestChainInfo, getStatusesForChain } =
  graphql;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Review: React.FC<Props> = ({
  questStatuses: inputQuestStatues,
  questChain: inputQuestChain,
}) => {
  const {
    questChain,
    fetching: fetchingQuests,
    refresh: refreshQuests,
  } = useLatestQuestChainData(inputQuestChain);

  const {
    questStatuses,
    fetching: fetchingStatuses,
    refresh: refreshStatuses,
  } = useLatestQuestStatusesForChainData(
    questChain?.chainId,
    questChain?.address,
    inputQuestStatues,
  );

  const refresh = useCallback(() => {
    refreshStatuses();
    refreshQuests();
  }, [refreshStatuses, refreshQuests]);
  const fetching = fetchingStatuses || fetchingQuests;

  const { isFallback } = useRouter();
  const { address } = useWallet();
  const isReviewer: boolean = useMemo(
    () =>
      questChain?.reviewers.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
  );

  if (isFallback) {
    return (
      <VStack>
        <Spinner color="main" />
      </VStack>
    );
  }
  if (!questChain) {
    return (
      <VStack>
        <Text> Quest Chain not found! </Text>
      </VStack>
    );
  }

  const ReviewHead = () => (
    <Head>
      <title>
        {`Review - ${questChain.name} - ${
          AVAILABLE_NETWORK_INFO[questChain.chainId].name
        }`}
      </title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );

  if (!isReviewer) {
    return (
      <VStack>
        <ReviewHead />
        <Text> Cannot review quest chain! </Text>
      </VStack>
    );
  }

  if (questChain.version === '0') {
    return (
      <>
        <ReviewHead />
        <QuestChainV0ReviewPage
          {...{ questChain, questStatuses, fetching, refresh }}
        />
      </>
    );
  }

  return (
    <>
      <ReviewHead />
      <QuestChainV1ReviewPage
        {...{ questChain, questStatuses, fetching, refresh }}
      />
    </>
  );
};

type QueryParams = { address: string; chainId: string };

export async function getStaticPaths() {
  const paths: { params: QueryParams }[] = [];

  await Promise.all(
    graphql.SUPPORTED_NETWORKS.map(async chainId => {
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
  if (chainId && address) {
    try {
      questStatuses = address
        ? await getStatusesForChain(chainId, address)
        : [];
      questChain = address ? await getQuestChainInfo(chainId, address) : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `Could not fetch Quest Chain/Statuses for address ${address}`,
        error,
      );
    }
  }

  return {
    props: {
      questStatuses,
      questChain,
    },
    revalidate: 1,
  };
};

export default Review;
