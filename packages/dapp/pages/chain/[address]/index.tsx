/* eslint-disable import/no-unresolved */
import { EditIcon, SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Signer } from 'ethers';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

import { AddQuestBlock } from '@/components/AddQuestBlock';
import { CollapsableText } from '@/components/CollapsableText';
import { SubmitButton } from '@/components/SubmitButton';
import {
  getQuestChainAddresses,
  getQuestChainInfo,
} from '@/graphql/questChains';
import { Status } from '@/graphql/types';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForUserAndChainData } from '@/hooks/useLatestQuestStatusesForUserAndChainData';
import { QuestChain, QuestChain__factory } from '@/types';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import {
  Metadata,
  uploadFilesViaAPI,
  uploadMetadataViaAPI,
} from '@/utils/metadata';
import { useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

type UserStatusType = {
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
    status: Status;
  };
};

const QuestChain: React.FC<Props> = ({ questChain: inputQuestChain }) => {
  const { isFallback } = useRouter();
  const { address, provider } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quest, setQuest] = useState<{
    questId: string;
    name: string | null | undefined;
    description: string | null | undefined;
  } | null>(null);
  const [proofDescription, setProofDescription] = useState('');
  const [myFiles, setMyFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles],
  );

  const {
    questChain,
    fetching: fetchingQuests,
    refresh: refreshQuests,
  } = useLatestQuestChainData(inputQuestChain);

  const {
    questStatuses,
    fetching: fetchingStatus,
    refresh: refreshStatus,
  } = useLatestQuestStatusesForUserAndChainData(
    questChain?.address,
    address,
    [],
  );

  const isAdmin: boolean = useMemo(
    () =>
      questChain?.admins.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
  );
  const isEditor: boolean = useMemo(
    () =>
      questChain?.editors.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
  );
  const isReviewer: boolean = useMemo(
    () =>
      questChain?.editors.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
  );

  const isUser = !(isAdmin || isEditor || isReviewer);

  const userStatus: UserStatusType = useMemo(() => {
    const userStat: UserStatusType = {};
    questStatuses.forEach(item => {
      userStat[item.quest.questId] = {
        status: item.status,
        submissions: item.submissions.map(sub => ({
          description: sub.description,
          externalUrl: sub.externalUrl,
          timestamp: sub.timestamp,
        })),
        reviews: item.reviews.map(sub => ({
          description: sub.description,
          externalUrl: sub.externalUrl,
          timestamp: sub.timestamp,
          accepted: sub.accepted,
          reviewer: sub.reviewer.id,
        })),
      };
    });
    return userStat;
  }, [questStatuses]);

  const fetching = fetchingStatus || fetchingQuests;

  const refresh = useCallback(() => {
    refreshStatus();
    refreshQuests();
  }, [refreshQuests, refreshStatus]);

  const contract: QuestChain = QuestChain__factory.connect(
    questChain?.address ?? '',
    provider?.getSigner() as Signer,
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
    setProofDescription('');
    setMyFiles([]);
    setQuest(null);
    onClose();
  }, [onClose]);

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(async () => {
    if (quest && proofDescription && myFiles.length > 0) {
      setSubmitting(true);
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
        let hash = await uploadFilesViaAPI(myFiles);
        const metadata: Metadata = {
          name: `Submission - Quest - ${quest.name} - User - ${address}`,
          description: proofDescription,
          external_url: `ipfs://${hash}`,
        };

        hash = await uploadMetadataViaAPI(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm the transaction in your Wallet',
        );
        const tx = await contract.submitProof(quest.questId, details);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully submitted proof');
        refresh();
        onModalClose();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setSubmitting(false);
    }
  }, [
    proofDescription,
    myFiles,
    quest,
    address,
    contract,
    refresh,
    onModalClose,
  ]);

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
    <VStack w="100%" align="flex-start" color="main" px={isUser ? 40 : 0}>
      <Head>
        <title>{questChain.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <VStack>
        <Flex justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold">
            {questChain.name}
          </Text>
          <EditIcon />
        </Flex>
        <Text fontWeight="lg" color="white">
          {questChain.description}
        </Text>
      </VStack>

      <SimpleGrid columns={isUser ? 1 : 2} spacing={16} pt={8} w="100%">
        <VStack spacing={6}>
          {fetching ? (
            <Spinner />
          ) : (
            <>
              <Text
                w="100%"
                color="white"
                fontSize={20}
                textTransform="uppercase"
              >
                {questChain.quests.length} Quests found
              </Text>
              {questChain.quests.map(quest => (
                <Flex
                  w="100%"
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  p={8}
                  gap={3}
                  borderRadius={20}
                  align="stretch"
                  key={quest.questId}
                  justifyContent="space-between"
                >
                  <Flex flexDirection="column">
                    <CollapsableText title={quest.name}>
                      <Text mx={4} mt={2} color="white" fontStyle="italic">
                        {quest.description}
                      </Text>
                    </CollapsableText>
                  </Flex>

                  {isUser && (
                    <>
                      {
                        // TODO: Also display prev submissions and reviews here
                        !userStatus[quest.questId]?.status ||
                        userStatus[quest.questId]?.status === 'init' ||
                        userStatus[quest.questId]?.status === 'fail' ? (
                          <Box>
                            <Button
                              onClick={() => {
                                setQuest({
                                  questId: quest.questId,
                                  name: quest.name,
                                  description: quest.description,
                                });
                                onOpen();
                              }}
                            >
                              Upload Proof
                            </Button>
                          </Box>
                        ) : (
                          <Box>
                            <Button
                              pointerEvents="none"
                              _hover={{}}
                              cursor="default"
                              color={
                                userStatus[quest.questId]?.status === 'review'
                                  ? 'pending'
                                  : 'main'
                              }
                              border="1px solid"
                              borderColor={
                                userStatus[quest.questId]?.status === 'review'
                                  ? 'pending'
                                  : 'main'
                              }
                            >
                              {userStatus[quest.questId]?.status === 'review'
                                ? 'Review Pending'
                                : 'Accepted'}
                            </Button>
                          </Box>
                        )
                      }
                    </>
                  )}
                </Flex>
              ))}
            </>
          )}
        </VStack>

        <Modal isOpen={!!quest && isOpen} onClose={onModalClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Proof - {quest?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl isRequired>
                <FormLabel color="main" htmlFor="proofDescription">
                  Description
                </FormLabel>
                <Textarea
                  id="proofDescription"
                  value={proofDescription}
                  onChange={e => setProofDescription(e.target.value)}
                  mb={4}
                />
              </FormControl>
              <FormControl isRequired>
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
                  <Box alignSelf="center">
                    {`Drag 'n' drop some files here`}
                  </Box>
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
              <Button
                variant="ghost"
                mr={3}
                onClick={onModalClose}
                borderRadius="full"
              >
                Close
              </Button>
              <SubmitButton
                mt={4}
                type="submit"
                onClick={onSubmit}
                isDisabled={!myFiles.length || !proofDescription}
                isLoading={isSubmitting}
              >
                Submit
              </SubmitButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <VStack spacing={8}>
          <AddQuestBlock questChain={questChain} refresh={refresh} />
        </VStack>
      </SimpleGrid>
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

  let questChain = null;
  try {
    questChain = address ? await getQuestChainInfo(address) : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Could not fetch Quest Chain for address ${address}`, error);
  }

  return {
    props: {
      questChain,
    },
    revalidate: 1,
  };
};

export default QuestChain;
