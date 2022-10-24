import { AddIcon, CheckIcon, CloseIcon, InfoIcon } from '@chakra-ui/icons';
import {
  Accordion,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Fade,
  Flex,
  IconButton,
  Image,
  Input,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useTimeout,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import Edit from '@/assets/Edit.svg';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { AddQuestBlock } from '@/components/CreateChain/AddQuestBlock';
import { Page } from '@/components/Layout/Page';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { MintNFTTile } from '@/components/MintNFTTile';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { QuestChainPauseStatus } from '@/components/QuestChainPauseStatus';
import { QuestEditor } from '@/components/QuestEditor';
import { QuestTile } from '@/components/QuestTile';
import { Role } from '@/components/RoleTag';
import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import { useInputText } from '@/hooks/useInputText';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForChainData } from '@/hooks/useLatestQuestStatusesForChainData';
import { useLatestQuestStatusesForUserAndChainData } from '@/hooks/useLatestQuestStatusesForUserAndChainData';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useUserStatus } from '@/hooks/useUserStatus';
import { SUPPORTED_NETWORKS } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadata } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

const {
  getQuestChainAddresses,
  getQuestChainInfo,
  getStatusesForChain,
  Status,
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

enum Mode {
  MEMBER = 'MEMBER',
  QUESTER = 'QUESTER',
}

const getQuestBGColor = (
  status: graphql.Status | undefined | null,
  mode: Mode,
) => {
  if (mode === Mode.MEMBER || !status || status === Status.Init)
    return 'whiteAlpha.100';

  if (status === Status.Fail) return 'rejected.300';
  else if (status === Status.Review) return 'pending.300';
  else return 'main.300';
};

const ChainStat: React.FC<{ label: string; value: string | JSX.Element }> = ({
  label,
  value,
}) => (
  <Flex direction="column" justify="space-between">
    <Text color="whiteAlpha.600" fontSize="xs" textTransform="uppercase">
      {label}
    </Text>
    <Text>{value}</Text>
  </Flex>
);

const QuestChainPage: React.FC<Props> = ({
  questChain: inputQuestChain,
  questStatuses: inputAllQuestStatuses,
}) => {
  const { isFallback } = useRouter();
  const { address, chainId, provider } = useWallet();
  const [visible, setVisible] = useState(false);

  useTimeout(() => {
    setVisible(true);
  }, 1000);

  const {
    isOpen: isUpdateQuestChainConfirmationOpen,
    onOpen: onUpdateQuestChainConfirmationOpen,
    onClose: onUpdateQuestChainConfirmationClose,
  } = useDisclosure();
  const {
    isOpen: isOpenCreateQuest,
    onOpen: onOpenCreateQuest,
    onClose: onCloseCreateQUest,
  } = useDisclosure();

  const [isEditingQuestChain, setEditingQuestChain] = useState(false);
  const [isEditingQuest, setEditingQuest] = useState(false);

  const {
    questChain,
    fetching: fetchingQuests,
    refresh: refreshQuests,
  } = useLatestQuestChainData(inputQuestChain);

  const [chainNameRef, setChainName] = useInputText(questChain?.name || '');
  const [chainDescRef, setChainDescription] = useInputText(
    questChain?.description || '',
  );

  const [questEditId, setQuestEditId] = useState(0);

  const {
    questStatuses,
    fetching: fetchingStatus,
    refresh: refreshStatus,
  } = useLatestQuestStatusesForUserAndChainData(
    questChain?.chainId,
    questChain?.address,
    address,
  );

  const isOwner: boolean = useMemo(
    () =>
      questChain?.owners.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
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
      questChain?.reviewers.some(
        ({ address: a }) => a === address?.toLowerCase(),
      ) ?? false,
    [questChain, address],
  );

  const members: {
    [addr: string]: Role;
  } = useMemo(() => {
    const memberRoles: { [addr: string]: Role } = {};

    questChain?.reviewers.forEach(({ address }) => {
      memberRoles[address] = 'Reviewer';
    });

    questChain?.editors.forEach(({ address }) => {
      memberRoles[address] = 'Editor';
    });

    questChain?.admins.forEach(({ address }) => {
      memberRoles[address] = 'Admin';
    });

    questChain?.owners.forEach(({ address }) => {
      memberRoles[address] = 'Owner';
    });

    return memberRoles;
  }, [questChain]);

  const owners = Object.entries(members)
    .filter(([, role]) => role === 'Owner')
    .map(([address]) => address);
  const admins = Object.entries(members)
    .filter(([, role]) => role === 'Admin')
    .map(([address]) => address);
  const editors = Object.entries(members)
    .filter(([, role]) => role === 'Editor')
    .map(([address]) => address);
  const reviewers = Object.entries(members)
    .filter(([, role]) => role === 'Reviewer')
    .map(([address]) => address);

  const isUser = !(isOwner || isAdmin || isEditor || isReviewer);

  const [mode, setMode] = useState<Mode>(isUser ? Mode.QUESTER : Mode.MEMBER);

  useEffect(() => setMode(isUser ? Mode.QUESTER : Mode.MEMBER), [isUser]);

  const userStatus: UserStatusType = useUserStatus(questStatuses);

  const { questStatuses: allQuestStatuses } =
    useLatestQuestStatusesForChainData(
      questChain?.chainId,
      questChain?.address,
      inputAllQuestStatuses,
    );

  const numSubmissionsToReview = allQuestStatuses.filter(
    q => q.status === graphql.Status.Review,
  ).length;

  const { progress, canMint } = useUserProgress(
    address,
    questChain,
    userStatus,
  );

  const fetching = fetchingStatus || fetchingQuests;

  const refresh = useCallback(() => {
    refreshStatus();
    refreshQuests();
  }, [refreshQuests, refreshStatus]);

  const [isSubmittingQuestChain, setSubmittingQuestChain] = useState(false);

  const onSubmitQuestChain = useCallback(
    async ({ name, description }: { name: string; description: string }) => {
      if (!questChain?.chainId) return;
      if (!chainId || !provider || questChain?.chainId !== chainId) {
        toast.error(
          `Wrong Chain, please switch to ${
            AVAILABLE_NETWORK_INFO[questChain?.chainId].label
          }`,
        );
        return;
      }
      setSubmittingQuestChain(true);
      const metadata: Metadata = {
        name,
        description,
      };
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
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
        const tx = await contract.edit(details);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash, chainId);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
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
    [refresh, chainId, questChain, provider],
  );

  const [isAdding, setAdding] = useState(false);

  const onAddQuest = useCallback(
    async (name: string, description: string) => {
      if (!questChain?.chainId) return false;
      if (!chainId || !provider || questChain?.chainId !== chainId) {
        toast.error(
          `Wrong Chain, please switch to ${
            AVAILABLE_NETWORK_INFO[questChain?.chainId].label
          }`,
        );
        return false;
      }

      setAdding(true);

      const metadata: Metadata = {
        name,
        description,
      };
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');

      try {
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
          ? (contract as contracts.V1.QuestChain).createQuests([details])
          : (contract as contracts.V0.QuestChain).createQuest(details));
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash, chainId);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully added a new Quest');
        refresh();
        return true;
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
        return false;
      } finally {
        setAdding(false);
      }
    },
    [refresh, questChain, chainId, provider],
  );

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
        <Text> Quest Chain not found! </Text>
      </Page>
    );
  }

  return (
    <Page>
      <Box
        bgImage={ipfsUriToHttp(questChain.imageUrl)}
        position="fixed"
        height="100vh"
        width="100vw"
        top="0"
        left="0"
        opacity="0.05"
        bgPos="center"
        bgSize="cover"
        zIndex={-1}
      />
      <Fade in={visible} style={{ width: '100%' }}>
        <Head>
          <title>
            {`${questChain.name} - ${
              AVAILABLE_NETWORK_INFO[questChain.chainId].name
            }`}
          </title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <Flex
          direction="column"
          w="100%"
          justify="center"
          zIndex="10"
          align="stretch"
        >
          {questChain.paused && (
            <Alert status="warning" borderRadius="md" mb={6} height="14">
              <AlertIcon boxSize="1.75rem" />
              <AlertTitle>Quest Chain is disabled.</AlertTitle>
            </Alert>
          )}

          {/* Set Mode  */}
          {(isAdmin || isEditor || isReviewer) && (
            <Flex
              h={14}
              mb={14}
              bgColor="whiteAlpha.100"
              borderRadius={8}
              alignItems="center"
              justifyContent="center"
              zIndex={100}
              w="100%"
            >
              <Flex
                w={32}
                onClick={() => setMode(Mode.QUESTER)}
                bgColor={mode === Mode.QUESTER ? 'main.200' : 'whiteAlpha.100'}
                h={8}
                alignItems="center"
                justifyContent="center"
                borderLeftRadius={6}
                borderWidth={1}
                borderRightWidth={0}
                borderColor="main.700"
                cursor="pointer"
              >
                <Text fontSize="small" fontWeight="bold">
                  Quester Mode
                </Text>
              </Flex>
              <Flex
                w={32}
                onClick={() => setMode(Mode.MEMBER)}
                bgColor={mode === Mode.MEMBER ? 'main.200' : 'whiteAlpha.100'}
                h={8}
                alignItems="center"
                justifyContent="center"
                borderRightRadius={6}
                borderWidth={1}
                borderColor="main.700"
                cursor="pointer"
              >
                <Text fontSize="small" fontWeight="bold">
                  Member Mode
                </Text>
              </Flex>
            </Flex>
          )}

          {/* Quest Chain */}
          <Flex
            gap={10}
            justifyContent="space-between"
            direction={{ base: 'column', lg: 'row' }}
          >
            {/* Left */}
            <Flex flexDirection="column" w="full">
              {/* Quest Chain Title */}
              <Flex justifyContent="space-between" w="full">
                {!isEditingQuestChain && (
                  <Flex flexDirection="column" mb={8}>
                    <Text
                      fontSize="5xl"
                      fontWeight="bold"
                      lineHeight="3.5rem"
                      fontFamily="heading"
                      mb={3}
                    >
                      {questChain.name}
                    </Text>
                    <Box>
                      <NetworkDisplay chainId={questChain.chainId} />
                    </Box>
                  </Flex>
                )}

                {isEditingQuestChain && (
                  <>
                    <Input
                      fontSize="2xl"
                      fontWeight="bold"
                      fontFamily="heading"
                      mb={3}
                      defaultValue={chainNameRef.current}
                      onChange={e => setChainName(e.target.value)}
                    />
                    <IconButton
                      borderRadius="full"
                      onClick={() => {
                        if (
                          !chainId ||
                          !questChain ||
                          !provider ||
                          chainId !== questChain.chainId
                        ) {
                          toast.error(
                            `Wrong Chain, please switch to ${
                              AVAILABLE_NETWORK_INFO[questChain.chainId].label
                            }`,
                          );
                          return;
                        }
                        if (!chainNameRef.current) {
                          toast.error('Name cannot be empty');
                          return;
                        }
                        if (!chainDescRef.current) {
                          toast.error('Description cannot be empty');
                          return;
                        }
                        if (
                          chainNameRef.current === questChain.name &&
                          chainDescRef.current === questChain.description
                        ) {
                          toast.error('No change in name or description');
                          return;
                        }
                        onUpdateQuestChainConfirmationOpen();
                      }}
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

                    <ConfirmationModal
                      onSubmit={() => {
                        onUpdateQuestChainConfirmationClose();
                        onSubmitQuestChain({
                          name: chainNameRef.current,
                          description: chainDescRef.current,
                        });
                      }}
                      title="Update Quest Chain"
                      content="Are you sure you want to update this quest chain?"
                      isOpen={isUpdateQuestChainConfirmationOpen}
                      onClose={onUpdateQuestChainConfirmationClose}
                    />
                  </>
                )}
              </Flex>

              {/* Quest Chain Description */}
              <Flex mb={8}>
                {!isEditingQuestChain && questChain.description && (
                  <MarkdownViewer markdown={questChain.description} />
                )}
                {isEditingQuestChain && (
                  <MarkdownEditor
                    value={chainDescRef.current}
                    onChange={setChainDescription}
                  />
                )}
              </Flex>

              <Flex
                direction="column"
                display={{ base: 'flex', lg: 'none' }}
                align="center"
                w="100%"
                mb={12}
              >
                <ActionsAndImage
                  mode={mode}
                  isAdmin={isAdmin}
                  isOwner={isOwner}
                  onEdit={() => {
                    setEditingQuestChain(true);
                    setChainName(questChain.name ?? '');
                    setChainDescription(questChain.description ?? '');
                  }}
                  refresh={refresh}
                  chainId={chainId}
                  questChain={questChain}
                />
              </Flex>

              {/* Quest Chain Metadata */}
              <Flex mb={8} justifyContent="space-between" gap={1}>
                <ChainStat
                  label="Total Players"
                  value={questChain.numQuesters.toString()}
                />
                <ChainStat
                  label="Players Finished"
                  value={questChain.numCompletedQuesters.toString()}
                />
                <ChainStat
                  label="Quests"
                  value={questChain.quests
                    .filter(q => !q.paused)
                    .length.toString()}
                />
                <ChainStat
                  label="Date Created"
                  value={new Date(
                    questChain.createdAt * 1000,
                  ).toLocaleDateString('en-US')}
                />
                <ChainStat
                  label="Created by"
                  value={
                    <UserDisplay address={questChain.createdBy.id} size="sm" />
                  }
                />
              </Flex>

              {/* Progress */}
              {mode === Mode.QUESTER && (
                <Flex
                  w="full"
                  justifyContent="space-between"
                  h={6}
                  alignItems="center"
                  mb={6}
                >
                  <Flex
                    w="90%"
                    borderColor="whiteAlpha.200"
                    border="1px solid"
                    borderRadius={3}
                  >
                    <Box
                      bg="main"
                      w={`${
                        (progress.total
                          ? progress.completeCount / progress.total
                          : 0) * 100
                      }%`}
                    />
                    <Box
                      bgColor="pending"
                      w={`${
                        (progress.total
                          ? progress.inReviewCount / progress.total
                          : 0) * 100
                      }%`}
                    />
                    <Box bgColor="grey" h={2} />
                  </Flex>
                  <Text>
                    {`${Math.round(
                      (progress.total
                        ? progress.completeCount / progress.total
                        : 0) * 100,
                    )}%`}
                  </Text>
                </Flex>
              )}
              <Flex mb={12}>
                {/* to be implemented eventually */}
                {/* 
                {mode === Mode.QUESTER &&
                  progress.completeCount === 0 &&
                  progress.inReviewCount === 0 &&
                  progress.total !== 0 && (
                    <Button
                      borderWidth={1}
                      borderColor="main"
                      px={12}
                      py={2}
                      bgColor="main"
                      borderRadius="full"
                      color="black"
                      _hover={{
                        bgColor: 'main.950',
                      }}
                    >
                      START PLAYING
                    </Button>
                  )} */}
                {mode === Mode.MEMBER &&
                  numSubmissionsToReview != 0 &&
                  isReviewer && (
                    <Flex
                      w="full"
                      bgColor="rgba(29, 78, 216, 0.3)"
                      p={6}
                      borderRadius={8}
                      justifyContent="space-between"
                    >
                      <Flex justifyContent="center" alignItems="center">
                        <InfoIcon boxSize={'1.25rem'} mr={2} color="#3B82F6" />
                        {numSubmissionsToReview} proof submissions are awaiting
                        review
                      </Flex>
                      <NextLink
                        as={`/chain/${questChain.chainId}/${questChain.address}/review`}
                        href={`/chain/[chainId]/[address]/review`}
                        passHref
                      >
                        <ChakraLink display="block" _hover={{}}>
                          <SubmitButton
                            fontSize={14}
                            fontWeight="bold"
                            height={10}
                            px={6}
                          >
                            Review Submissions
                          </SubmitButton>
                        </ChakraLink>
                      </NextLink>
                    </Flex>
                  )}

                {/* Mint Tile */}
                {canMint && mode === Mode.QUESTER && (
                  <Flex pt={6} w="100%">
                    <MintNFTTile
                      {...{
                        questChain,
                        onSuccess: refresh,
                        completed: questChain.quests.filter(q => !q.paused)
                          .length,
                      }}
                    />
                  </Flex>
                )}
              </Flex>

              {/* Quests */}
              <VStack spacing={6} w="100%" pt={8}>
                {fetching ? (
                  <Spinner />
                ) : (
                  <>
                    <Flex
                      justifyContent="space-between"
                      w="full"
                      alignItems="center"
                    >
                      <Text fontSize={40} fontFamily="heading">
                        QUESTS
                      </Text>
                      {mode === Mode.MEMBER && isEditor && (
                        <Button onClick={onOpenCreateQuest} fontSize="xs">
                          <AddIcon fontSize="sm" mr={2} />
                          Create Quest
                        </Button>
                      )}
                    </Flex>

                    {mode === Mode.MEMBER && isEditor && (
                      <Modal
                        isOpen={isOpenCreateQuest}
                        onClose={onCloseCreateQUest}
                      >
                        <ModalOverlay
                          bg="blackAlpha.300"
                          backdropFilter="blur(10px)"
                        />
                        <ModalContent maxW="40rem">
                          <ModalHeader>Create Quest</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <AddQuestBlock
                              onAdd={onAddQuest}
                              isAdding={isAdding}
                              onClose={onCloseCreateQUest}
                            />
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    )}

                    {/* would be really nice if this was refactored by 
                  separating the whole quest actions logic into its own component, so:
                  - edit quest
                  - upload proof */}
                    <Accordion allowMultiple w="full" defaultIndex={[]}>
                      {questChain.quests
                        .filter(
                          q => !!q.name && (mode === Mode.MEMBER || !q.paused),
                        )
                        .map(
                          ({ name, description, questId, paused }, index) => (
                            <React.Fragment key={questId}>
                              {!(isEditingQuest && questEditId === questId) && (
                                <QuestTile
                                  name={`${index + 1}. ${name}`}
                                  description={description ?? ''}
                                  bgColor={getQuestBGColor(
                                    userStatus[questId]?.status,
                                    mode,
                                  )}
                                  onEditQuest={() => {
                                    setEditingQuest(true);
                                    setQuestEditId(questId);
                                  }}
                                  isMember={
                                    mode === Mode.MEMBER &&
                                    (isAdmin || isEditor)
                                  }
                                  questId={questId}
                                  questChain={questChain}
                                  userStatus={userStatus}
                                  isPaused={paused}
                                  refresh={refresh}
                                />
                              )}

                              {/* Edit quest components */}
                              {isEditingQuest && questEditId === questId && (
                                <QuestEditor
                                  refresh={refresh}
                                  questChain={questChain}
                                  quest={{
                                    name,
                                    description,
                                    questId,
                                    paused,
                                  }}
                                  setEditingQuest={setEditingQuest}
                                />
                              )}
                            </React.Fragment>
                          ),
                        )}
                    </Accordion>
                  </>
                )}
              </VStack>
            </Flex>

            {/* Right */}
            <Flex flexDirection="column" maxW={{ base: '100%', lg: 373 }}>
              <Flex
                flexDirection="column"
                w="100%"
                display={{ base: 'none', lg: 'flex' }}
              >
                <ActionsAndImage
                  mode={mode}
                  isAdmin={isAdmin}
                  isOwner={isOwner}
                  onEdit={() => {
                    setEditingQuestChain(true);
                    setChainName(questChain.name || '');
                  }}
                  refresh={refresh}
                  chainId={chainId}
                  questChain={questChain}
                />
              </Flex>
              {/* Quest Chain Members */}
              <Members
                owners={owners}
                admins={admins}
                editors={editors}
                reviewers={reviewers}
              />
            </Flex>
          </Flex>
        </Flex>
      </Fade>
    </Page>
  );
};

type ActionsAndImageProps = {
  mode: string;
  isAdmin: boolean;
  isOwner: boolean;
  onEdit: () => void;
  refresh: () => void;
  chainId: string | null | undefined;
  questChain: graphql.QuestChainInfoFragment;
};

const ActionsAndImage: React.FC<ActionsAndImageProps> = ({
  mode,
  isAdmin,
  isOwner,
  onEdit,
  refresh,
  chainId,
  questChain,
}) => (
  <>
    {/* Actions */}
    {mode === Mode.MEMBER &&
      chainId &&
      chainId === questChain.chainId &&
      (isAdmin || isOwner) && (
        <Flex justifyContent="space-between" w="100%">
          {isAdmin && (
            <Button variant="ghost" onClick={onEdit} fontSize="xs">
              <Image src={Edit.src} alt="Edit" mr={2} />
              Edit Metadata
            </Button>
          )}
          {isOwner && (
            <QuestChainPauseStatus questChain={questChain} refresh={refresh} />
          )}
        </Flex>
      )}

    {/* Image (Should be NFT) */}
    {questChain.token.imageUrl && (
      <Image
        src={ipfsUriToHttp(questChain.token.imageUrl)}
        alt="Quest Chain NFT badge"
        maxW={373}
      />
    )}
  </>
);

type RolesProps = {
  role: string;
  addresses: string[];
};

type MembersProps = {
  owners: string[];
  admins: string[];
  editors: string[];
  reviewers: string[];
};

const MemberSection: React.FC<RolesProps> = ({ role, addresses }) => (
  <>
    <Flex justify="space-between" alignItems="center" my={3} pl={4} w="100%">
      <Text color="whiteAlpha.600">{role}</Text>
      <Flex flexDir="column">
        {addresses.map(address => (
          <Box key={address}>
            {address && <UserDisplay address={address} />}
          </Box>
        ))}
      </Flex>
    </Flex>
    <Divider />
  </>
);

export const Members: React.FC<MembersProps> = ({
  owners,
  admins,
  editors,
  reviewers,
}) => (
  <Flex flexDir="column" width="full">
    <Text fontFamily="heading" fontSize="xl" mb={5}>
      Members
    </Text>
    <Divider />
    <MemberSection role="OWNERS" addresses={owners} />
    {admins.length !== 0 && <MemberSection role="ADMINS" addresses={admins} />}
    {editors.length !== 0 && (
      <MemberSection role="EDITORS" addresses={editors} />
    )}
    {reviewers.length !== 0 && (
      <MemberSection role="REVIEWERS" addresses={reviewers} />
    )}
  </Flex>
);

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
        `Could not fetch Quest Chain for address ${address}`,
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
