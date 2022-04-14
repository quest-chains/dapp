import {
  CheckIcon,
  CloseIcon,
  EditIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
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
import { CollapsableQuestDisplay } from '@/components/CollapsableQuestDisplay';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { SubmitButton } from '@/components/SubmitButton';
import {
  getQuestChainAddresses,
  getQuestChainInfo,
} from '@/graphql/questChains';
import { Status } from '@/graphql/types';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForUserAndChainData } from '@/hooks/useLatestQuestStatusesForUserAndChainData';
import { QuestChain, QuestChain__factory } from '@/types';
import { ZERO_ADDRESS } from '@/utils/constants';
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
  const {
    isOpen: isUpdateQuestConfirmationOpen,
    onOpen: onUpdateQuestConfirmationOpen,
    onClose: onUpdateQuestConfirmationClose,
  } = useDisclosure();
  const {
    isOpen: isUpdateQuestChainConfirmationOpen,
    onOpen: onUpdateQuestChainConfirmationOpen,
    onClose: onUpdateQuestChainConfirmationClose,
  } = useDisclosure();

  const [isEditingQuestChain, setEditingQuestChain] = useState(false);
  const [isEditingQuest, setEditingQuest] = useState(false);
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

  const [chainName, setChainName] = useState(questChain?.name || '');
  const [chainDescription, setChainDescription] = useState(
    questChain?.description || '',
  );

  const [questName, setQuestName] = useState('');
  const [questDescription, setQuestDescription] = useState('');

  const [questEditId, setQuestEditId] = useState(0);

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
    questChain?.address ?? ZERO_ADDRESS,
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
  const [isSubmittingQuest, setSubmittingQuest] = useState(false);
  const [isSubmittingQuestChain, setSubmittingQuestChain] = useState(false);

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

  const onSubmitQuestChain = useCallback(
    async ({ name, description }: { name: string; description: string }) => {
      setSubmittingQuestChain(true);
      const metadata: Metadata = {
        name,
        description,
      };
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
        const hash = await uploadMetadataViaAPI(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm the transaction in your Wallet',
        );
        const tx = await contract.edit(details);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(receipt.blockNumber);
        toast.dismiss(tid);
        toast.success(`Successfully updated the Quest Chain: ${name}`);
        refresh();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setEditingQuestChain(false);
      setSubmittingQuestChain(false);
    },
    [contract, refresh],
  );

  const onSubmitQuest = useCallback(
    async ({
      name,
      description,
      questId,
    }: {
      name: string;
      description: string;
      questId: number;
    }) => {
      setSubmittingQuest(true);
      const metadata: Metadata = {
        name,
        description,
      };
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
        const hash = await uploadMetadataViaAPI(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm the transaction in your Wallet',
        );
        const tx = await contract.editQuest(questId, details);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(receipt.blockNumber);
        toast.dismiss(tid);
        toast.success(`Successfully updated the Quest: ${name}`);
        refresh();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setEditingQuest(false);
      setSubmittingQuest(false);
    },
    [contract, refresh],
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
    <VStack
      w="100%"
      align="flex-start"
      color="main"
      px={isUser ? { base: 0, lg: 40 } : 0}
    >
      <Head>
        <title>{questChain.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Flex flexDirection="column" w="full" justify="center">
        <Flex justifyContent="space-between" w="full">
          {!isEditingQuestChain && (
            <>
              <Text fontSize="2xl" fontWeight="bold" mb={3}>
                {questChain.name}
              </Text>
              {isAdmin && (
                <IconButton
                  borderRadius="full"
                  onClick={() => {
                    setEditingQuestChain(true);
                    setChainName(questChain.name || '');
                    setQuestDescription(questChain.description || '');
                  }}
                  icon={<EditIcon boxSize="1rem" />}
                  aria-label={''}
                />
              )}
            </>
          )}

          {isEditingQuestChain && (
            <>
              <Input
                fontSize="2xl"
                fontWeight="bold"
                mb={3}
                value={chainName}
                onChange={e => setChainName(e.target.value)}
              />
              <IconButton
                borderRadius="full"
                onClick={onUpdateQuestChainConfirmationOpen}
                isDisabled={isSubmittingQuestChain}
                icon={<CheckIcon boxSize="1rem" />}
                aria-label={''}
                mx={2}
              />
              <IconButton
                borderRadius="full"
                onClick={() => setEditingQuestChain(false)}
                isDisabled={isSubmittingQuestChain}
                icon={<CloseIcon boxSize="1rem" />}
                aria-label={''}
              />
            </>
          )}
        </Flex>

        <Flex w="full">
          {!isEditingQuestChain && questChain.description && (
            <MarkdownViewer markdown={questChain.description} />
          )}

          {isEditingQuestChain && (
            <MarkdownEditor
              value={chainDescription}
              onChange={setChainDescription}
            />
          )}
        </Flex>

        <ConfirmationModal
          onSubmit={() => {
            onUpdateQuestChainConfirmationClose();
            onSubmitQuestChain({
              name: chainName,
              description: chainDescription,
            });
          }}
          title="Update Quest Chain"
          content="Are you sure you want to update this quest chain?"
          isOpen={isUpdateQuestChainConfirmationOpen}
          onClose={onUpdateQuestChainConfirmationClose}
        />
      </Flex>

      <SimpleGrid
        columns={isUser ? 1 : { base: 1, lg: 2 }}
        spacing={16}
        pt={8}
        w="100%"
      >
        <VStack spacing={6} px={isUser ? { base: 0, lg: 40 } : 0}>
          {fetching ? (
            <Spinner />
          ) : (
            <>
              <Text
                w="full"
                color="white"
                fontSize={20}
                textTransform="uppercase"
              >
                {questChain.quests.length} Quests found
              </Text>
              {questChain.quests.map(quest => (
                <Flex
                  w="full"
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  p={8}
                  gap={3}
                  borderRadius={20}
                  align="stretch"
                  key={quest.questId}
                  justifyContent="space-between"
                >
                  <Flex flexDirection="column" w="full">
                    {!(isEditingQuest && questEditId === quest.questId) && (
                      <Flex justifyContent="space-between" w="full">
                        <CollapsableQuestDisplay {...quest} />
                        {(isAdmin || isEditor) && (
                          <IconButton
                            borderRadius="full"
                            onClick={() => {
                              setEditingQuest(true);
                              setQuestName(quest.name || '');
                              setQuestDescription(quest.description || '');
                              setQuestEditId(quest.questId);
                            }}
                            icon={<EditIcon boxSize="1rem" />}
                            aria-label={''}
                          />
                        )}
                      </Flex>
                    )}

                    {isEditingQuest && questEditId === quest.questId && (
                      <Flex flexDirection="column">
                        <Flex>
                          <Input
                            mb={3}
                            value={questName}
                            onChange={e => setQuestName(e.target.value)}
                          />
                          <IconButton
                            borderRadius="full"
                            onClick={onUpdateQuestConfirmationOpen}
                            isDisabled={isSubmittingQuest}
                            icon={<CheckIcon boxSize="1rem" />}
                            aria-label={''}
                            mx={2}
                          />
                          <IconButton
                            borderRadius="full"
                            onClick={() => setEditingQuest(false)}
                            isDisabled={isSubmittingQuest}
                            icon={<CloseIcon boxSize="1rem" />}
                            aria-label={''}
                          />
                          <ConfirmationModal
                            onSubmit={() => {
                              onUpdateQuestConfirmationClose();
                              onSubmitQuest({
                                name: questName,
                                description: questDescription,
                                questId: quest.questId,
                              });
                            }}
                            title="Update Quest"
                            content="Are you sure you want to update this quest?"
                            isOpen={isUpdateQuestConfirmationOpen}
                            onClose={() => {
                              setChainDescription(quest.description || '');
                              setChainName(quest.name || '');
                              onUpdateQuestConfirmationClose();
                            }}
                          />
                        </Flex>

                        <MarkdownEditor
                          value={questDescription}
                          onChange={setQuestDescription}
                        />
                      </Flex>
                    )}
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
        <VStack spacing={8}>
          <AddQuestBlock questChain={questChain} refresh={refresh} />
        </VStack>
      </SimpleGrid>

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
