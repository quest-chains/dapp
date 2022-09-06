import { ExternalLinkIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

import { CollapsableText } from '@/components/CollapsableText';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { formatAddress, SUPPORTED_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

const { getQuestChainAddresses, getQuestChainInfo, getStatusesForChain } =
  graphql;

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const StatusDisplay: React.FC<{
  review: graphql.QuestStatusInfoFragment;
  onSelect: (quest: ModalQuestType) => void;
  isDisabled: boolean;
}> = ({ review, onSelect, isDisabled }) => {
  const { quest, submissions, user } = review;

  const { description, externalUrl } = submissions[submissions.length - 1];

  const url = ipfsUriToHttp(externalUrl);

  const isSmallerScreen = useBreakpointValue({ base: true, md: false });

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
        <CollapsableText title={quest.name}>
          <Box mt={2} color="white">
            <MarkdownViewer markdown={description ?? ''} />
          </Box>
        </CollapsableText>
        <UserDisplay address={user.id} />
      </HStack>
      <Flex w="100%" fontSize="lg">
        <MarkdownViewer markdown={description ?? ''} />
      </Flex>
      <HStack justify="space-between" w="100%" pt={4}>
        {url ? (
          <Link isExternal href={url} _hover={{}}>
            <SubmitButton color="white" rightIcon={<ExternalLinkIcon />}>
              {isSmallerScreen ? 'Attachments' : 'View Attachments'}
            </SubmitButton>
          </Link>
        ) : (
          <Box />
        )}
        <SubmitButton
          borderColor="rejected"
          // color="rejected"
          isDisabled={isDisabled}
          onClick={() =>
            onSelect({
              userId: user.id,
              questId: quest.questId,
              name: quest.name,
              description: quest.description,
            })
          }
        >
          {isSmallerScreen ? 'Review' : 'Review Submission'}
        </SubmitButton>
      </HStack>
    </VStack>
  );
};

type ModalQuestType = {
  userId: string;
  questId: string;
  name: string | null | undefined;
  description: string | null | undefined;
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quest, setQuest] = useState<ModalQuestType | null>(null);

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

  const [rejecting, setRejecting] = useState(false);
  const [accepting, setAccepting] = useState(false);

  const { provider, address, chainId } = useWallet();

  const reviews = useMemo(() => {
    if (questStatuses) return questStatuses.filter(q => q.status === 'review');
    return [];
  }, [questStatuses]);

  const [reviewDescription, setReviewDescription] = useState('');
  const [myFiles, setMyFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const removeFile = (file: File) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const onModalClose = useCallback(() => {
    setReviewDescription('');
    setMyFiles([]);
    setQuest(null);
    onClose();
  }, [onClose]);

  const onSelect = useCallback(
    (selected: ModalQuestType) => {
      setQuest(selected);
      onOpen();
    },
    [onOpen],
  );

  const onSubmit = useCallback(
    async (success: boolean) => {
      if (
        !chainId ||
        !questChain ||
        !provider ||
        chainId !== questChain.chainId
      )
        return;
      if (quest && reviewDescription) {
        setRejecting(!success);
        setAccepting(success);

        let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
        try {
          const metadata: Metadata = {
            name: `Review - Quest - ${quest.name} - User - ${quest.userId} - Reviewer - ${address}`,
            description: reviewDescription,
          };
          if (myFiles.length > 0) {
            const filesHash = await uploadFiles(myFiles);
            metadata.external_url = `ipfs://${filesHash}`;
          }

          const hash = await uploadMetadata(metadata);
          const details = `ipfs://${hash}`;
          toast.dismiss(tid);
          tid = toast.loading(
            'Waiting for Confirmation - Confirm the transaction in your Wallet',
          );

          const contract = getQuestChainContract(
            questChain.address,
            questChain.version,
            provider.getSigner(),
          );
          const tx = await (questChain.version === '1'
            ? (contract as contracts.V1.QuestChain).reviewProofs(
                [quest.userId],
                [quest.questId],
                [success],
                [details],
              )
            : (contract as contracts.V0.QuestChain).reviewProof(
                quest.userId,
                quest.questId,
                success,
                details,
              ));
          toast.dismiss(tid);
          tid = handleTxLoading(tx.hash, chainId);
          const receipt = await tx.wait(1);
          toast.dismiss(tid);
          tid = toast.loading(
            'Transaction confirmed. Waiting for The Graph to index the transaction data.',
          );
          await waitUntilBlock(chainId, receipt.blockNumber);
          toast.dismiss(tid);
          toast.success(
            `Successfully ${success ? 'Accepted' : 'Rejected'} the Submission!`,
          );
          refresh();
          onModalClose();
        } catch (error) {
          toast.dismiss(tid);
          handleError(error);
        }

        setRejecting(false);
        setAccepting(false);
      }
    },
    [
      refresh,
      quest,
      reviewDescription,
      myFiles,
      onModalClose,
      address,
      chainId,
      questChain,
      provider,
    ],
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
    <VStack w="100%" px={{ base: 0, md: 12, lg: 40 }} spacing={8}>
      <Head>
        <title>
          Review - {questChain.name} -{' '}
          {SUPPORTED_NETWORK_INFO[questChain.chainId].name}
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <VStack w="100%" align="flex-start" color="main">
        <Text fontSize="2xl" fontWeight="bold">
          {questChain.name}
        </Text>
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
                reviews.length === 1 ? '' : 's'
              } found`}
            </Text>
            {reviews.map(review => (
              <StatusDisplay
                review={review}
                onSelect={onSelect}
                key={review.id}
                isDisabled={chainId !== questChain?.chainId}
              />
            ))}
          </>
        )}
      </VStack>
      <Modal isOpen={!!quest && isOpen} onClose={onModalClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="40rem">
          <ModalHeader>
            Review Proof - {quest?.name} -{' '}
            {formatAddress(quest?.userId).toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel color="main" htmlFor="reviewDescription">
                Description
              </FormLabel>
              <Flex pb={4} w="100%">
                <MarkdownEditor
                  value={reviewDescription}
                  onChange={v => setReviewDescription(v)}
                />
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel color="main" htmlFor="file">
                Upload file
              </FormLabel>
              <Flex
                {...getRootProps({ className: 'dropzone' })}
                flexDir="column"
                borderWidth={1}
                borderStyle="dashed"
                borderRadius={20}
                p={10}
                mb={4}
                onClick={open}
              >
                <input {...getInputProps()} color="white" />
                <Box alignSelf="center">{`Drag 'n' drop some files here`}</Box>
              </Flex>
            </FormControl>
            <Text mb={1}>Files:</Text>
            {myFiles.map((file: File) => (
              <Flex key={file.name} w="100%" mb={1}>
                <IconButton
                  size="xs"
                  borderRadius="full"
                  onClick={removeFile(file)}
                  icon={<SmallCloseIcon boxSize="1rem" />}
                  aria-label={''}
                />
                <Text ml={1} alignSelf="center">
                  {file.name} - {file.size} bytes
                </Text>
              </Flex>
            ))}
          </ModalBody>

          <ModalFooter alignItems="baseline">
            <HStack justify="space-between" spacing={4}>
              <Button
                variant="ghost"
                mr={3}
                onClick={onModalClose}
                borderRadius="full"
              >
                Close
              </Button>
              <SubmitButton
                borderColor="rejected"
                // color="rejected"
                isLoading={rejecting}
                isDisabled={!reviewDescription}
                onClick={() => onSubmit(false)}
              >
                Reject
              </SubmitButton>
              <SubmitButton
                borderColor="main"
                // color="main"
                isLoading={accepting}
                isDisabled={!reviewDescription}
                onClick={() => onSubmit(true)}
              >
                Accept
              </SubmitButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

type QueryParams = { address: string; chainId: string };

export async function getStaticPaths() {
  const paths: { params: QueryParams }[] = [];

  await Promise.all(
    Object.keys(SUPPORTED_NETWORK_INFO).map(async chainId => {
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
