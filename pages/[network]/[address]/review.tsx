import { ArrowBackIcon } from '@chakra-ui/icons';
import { Flex, Heading, Link as ChakraLink, Text } from '@chakra-ui/react';
import { isAddress } from '@ethersproject/address';
import { graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';

import { Page } from '@/components/Layout/Page';
import { LoadingState } from '@/components/LoadingState';
import { QuestChainV0ReviewPage } from '@/components/Review/QuestChainV0ReviewPage';
import { QuestChainV1ReviewPage } from '@/components/Review/QuestChainV1ReviewPage';
import { HeadComponent } from '@/components/Seo';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { getQuestChainURL } from '@/utils/uriHelpers';
import { AVAILABLE_NETWORK_INFO, CHAIN_URL_MAPPINGS, useWallet } from '@/web3';

const { getQuestChainInfo, getStatusesForChain, getQuestChainFromSlug } =
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
  const { address, isConnecting } = useWallet();

  const isReviewer: boolean = useMemo(
    () =>
      questChain?.reviewers.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
  );

  if (
    isFallback ||
    fetching ||
    isConnecting ||
    (!questChain && !!inputQuestChain)
  ) {
    return (
      <Page align="center">
        <LoadingState />
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

  const ReviewHead = () => (
    <>
      <HeadComponent
        title={`Review - ${questChain.name} - ${
          AVAILABLE_NETWORK_INFO[questChain.chainId].name
        }`}
        description={`Review submissions for this quest chain`}
        url={getQuestChainURL(questChain)}
      />
      <Flex w="full">
        <NextLink
          as={`/${AVAILABLE_NETWORK_INFO[questChain.chainId].urlName}/${
            questChain.address
          }`}
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
        console.error(error);
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
        console.error(error);
      }
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
