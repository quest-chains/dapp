import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex, Link as ChakraLink, Spinner, Text } from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { Page } from '@/components/Layout/Page';
import { QuestChainV0ReviewPage } from '@/components/Review/QuestChainV0ReviewPage';
import { QuestChainV1ReviewPage } from '@/components/Review/QuestChainV1ReviewPage';
import { HeadComponent } from '@/components/Seo';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { QUESTCHAINS_URL, SUPPORTED_NETWORKS } from '@/utils/constants';
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

  const { isFallback, asPath } = useRouter();
  const { address, isConnecting } = useWallet();

  const isReviewer: boolean = useMemo(
    () =>
      questChain?.reviewers.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
  );

  if (isFallback || fetching || isConnecting) {
    return (
      <Page>
        <Spinner color="main" />
      </Page>
    );
  }

  if (!questChain) {
    return (
      <Page>
        <Text>Quest chain not found!</Text>
      </Page>
    );
  }

  const ReviewHead = () => (
    <>
      <HeadComponent
        title={`Review - ${questChain.name} - ${
          AVAILABLE_NETWORK_INFO[questChain.chainId].name
        }`}
        description={`Review submissions for this quest chain`}
        url={QUESTCHAINS_URL + asPath}
      />
      <Flex w="full">
        <NextLink
          as={`/${questChain.chainId}/${questChain.address}`}
          href="/[chainId]/[address]"
          passHref
        >
          <ChakraLink display="block" _hover={{}} w="full">
            <Flex alignItems="center" _hover={{ textDecor: 'underline' }}>
              <ArrowBackIcon mr={2} />
              <Text fontSize={14}>Back to quest chain details</Text>
            </Flex>
          </ChakraLink>
        </NextLink>
      </Flex>
    </>
  );

  if (!isReviewer) {
    return (
      <Page>
        <ReviewHead />
        <Text> Cannot review quest chain! </Text>
      </Page>
    );
  }

  if (questChain.version === '0') {
    return (
      <Page>
        <ReviewHead />
        <QuestChainV0ReviewPage
          {...{ questChain, questStatuses, fetching, refresh }}
        />
      </Page>
    );
  }

  return (
    <Page>
      <ReviewHead />
      <QuestChainV1ReviewPage
        {...{ questChain, questStatuses, fetching, refresh }}
      />
    </Page>
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
  if (chainId && address) {
    try {
      questStatuses = address
        ? await getStatusesForChain(chainId, address)
        : [];
      questChain = address ? await getQuestChainInfo(chainId, address) : null;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        `Could not fetch quest chains/statuses for address ${address}`,
        error,
      );
    }
  }

  return {
    props: {
      questStatuses,
      questChain,
    },
    revalidate: 60,
  };
};

export default Review;
