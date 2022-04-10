/* eslint-disable import/no-unresolved */
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Flex, HStack, Link, Spinner, Text, VStack } from '@chakra-ui/react';
import { Signer } from 'ethers';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { CollapsableText } from '@/components/CollapsableText';
import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import {
  getQuestChainAddresses,
  getQuestChainInfo,
} from '@/graphql/questChains';
import { getStatusesForChain } from '@/graphql/questStatuses';
import { QuestStatusInfoFragment } from '@/graphql/types';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { QuestChain, QuestChain__factory } from '@/types';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const StatusDisplay: React.FC<{
  review: QuestStatusInfoFragment;
  refresh: () => void;
}> = ({ review, refresh }) => {
  const { quest, description, externalUrl, user, questChain } = review;

  const hash = externalUrl?.split('/').pop();
  const url = `https://${hash}.ipfs.infura-ipfs.io`;

  const [rejecting, setRejecting] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const { provider } = useWallet();
  const contract: QuestChain = QuestChain__factory.connect(
    questChain.address,
    provider?.getSigner() as Signer,
  );

  const onSubmit = useCallback(
    async (questId: string, user: string, success: boolean) => {
      setRejecting(!success);
      setAccepting(success);

      let tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      try {
        const tx = await contract.reviewProof(user, questId, success);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(receipt.blockNumber);
        toast.dismiss(tid);
        toast.success(
          `Successfully ${success ? 'Accepted' : 'Rejected'} the Submission!`,
        );
        refresh();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setRejecting(false);
      setAccepting(false);
    },
    [contract, refresh],
  );

  return (
    <VStack
      w="100%"
      boxShadow="inset 0px 0px 0px 1px #AD90FF"
      p={8}
      spacing={2}
      borderRadius={20}
      align="stretch"
    >
      <HStack align="flex-start" justify="space-between" w="100%">
        <Flex direction="column">
          <CollapsableText title={quest.name}>
            <Text mx={4} mt={2} color="white" fontStyle="italic">
              {quest.description}
            </Text>
          </CollapsableText>
        </Flex>
        <UserDisplay address={user.id} />
      </HStack>
      <Text fontSize="lg">{description}</Text>
      <HStack justify="space-between" w="100%" pt={4}>
        <Link isExternal href={url} _hover={{}}>
          <SubmitButton color="white" rightIcon={<ExternalLinkIcon />}>
            view proof on IPFS
          </SubmitButton>
        </Link>
        <HStack justify="space-between" spacing={4}>
          <SubmitButton
            borderColor="rejected"
            color="rejected"
            isLoading={rejecting}
            onClick={() => onSubmit(quest.questId, user.id, false)}
          >
            reject
          </SubmitButton>
          <SubmitButton
            borderColor="main"
            color="main"
            isLoading={accepting}
            onClick={() => onSubmit(quest.questId, user.id, true)}
          >
            accept
          </SubmitButton>
        </HStack>
      </HStack>
    </VStack>
  );
};

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
    questChain?.address,
    inputQuestStatues,
  );

  const refresh = () => {
    refreshStatuses();
    refreshQuests();
  };
  const fetching = fetchingStatuses || fetchingQuests;

  const { isFallback } = useRouter();

  const reviews = useMemo(
    () => questStatuses.filter(q => q.status === 'review'),
    [questStatuses],
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

  return (
    <VStack px={40} spacing={8}>
      <Head>
        <title>{questChain.name} Review</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <VStack w="100%" align="flex-start" color="main">
        <Text fontSize="2xl" fontWeight="bold">
          {questChain.name}
        </Text>
        <Text fontWeight="lg">{questChain.description}</Text>
      </VStack>
      <VStack w="100%" spacing={6}>
        {fetching ? (
          <Spinner color="main" />
        ) : (
          <>
            <Text
              fontSize={20}
              textTransform="uppercase"
              color="white"
              w="100%"
            >
              {`${reviews.length} Quest Submission${
                reviews.length > 1 ? 's' : ''
              } found`}
            </Text>
            {reviews.map(review => (
              <StatusDisplay
                review={review}
                refresh={refresh}
                key={review.id}
              />
            ))}
          </>
        )}
      </VStack>
    </VStack>
  );
};

type QueryParams = { address: string };

export async function getStaticPaths() {
  const addresses = await getQuestChainAddresses(1000);
  const paths = addresses.map(address => ({
    params: { address },
  }));

  return { paths, fallback: true };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const address = context.params?.address;

  let questStatuses: QuestStatusInfoFragment[] = [];
  let questChain = null;
  try {
    questStatuses = address ? await getStatusesForChain(address) : [];
    questChain = address ? await getQuestChainInfo(address) : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Could not fetch Quest Chain/Statuses for address ${address}`,
      error,
    );
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
