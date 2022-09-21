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
import { graphql } from '@quest-chains/sdk';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import Edit from '@/assets/Edit.svg';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { Quest } from '@/components/CreateChain/QuestsForm';
import { AddQuestBlock } from '@/components/CreateQuest/AddQuestBlock';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { MintNFTTile } from '@/components/MintNFTTile';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { QuestChainPauseStatus } from '@/components/QuestChainPauseStatus';
import { QuestEditor } from '@/components/QuestEditor';
import { Role } from '@/components/RoleTag';
import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useLatestQuestStatusesForUserAndChainData } from '@/hooks/useLatestQuestStatusesForUserAndChainData';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadata } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

const { getQuestChainAddresses, getQuestChainInfo } = graphql;

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

const QuestChainPage: React.FC<Props> = ({ questChain: inputQuestChain }) => {
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

  const [chainName, setChainName] = useState(questChain?.name || '');
  const [chainDescription, setChainDescription] = useState(
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
      questChain?.editors.some(
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

  const [progress, setProgress] = useState({
    total: 0,
    inReviewCount: 0,
    completeCount: 0,
  });
  useEffect(() => {
    if (questChain) {
      if (questChain?.quests) {
        const inReviewCount = questChain.quests.filter(
          quest => userStatus[quest.questId]?.status === 'review',
        ).length;
        const completeCount = questChain.quests.filter(
          quest => userStatus[quest.questId]?.status === 'pass',
        ).length;

        setProgress({
          inReviewCount: inReviewCount || 0,
          completeCount: completeCount || 0,
          total: questChain.quests.length || 0,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questChain, userStatus]);

  const canMint = useMemo(
    () =>
      !!address &&
      questChain?.token &&
      !questChain.token.owners.find(o => o.id === address.toLowerCase()) &&
      Object.values(userStatus).length === questChain.quests.length &&
      Object.values(userStatus).reduce(
        (t, v) => t && v.status === graphql.Status.Pass,
        true,
      ),
    [questChain, address, userStatus],
  );

  const fetching = fetchingStatus || fetchingQuests;

  const refresh = useCallback(() => {
    refreshStatus();
    refreshQuests();
  }, [refreshQuests, refreshStatus]);

  const [isSubmittingQuestChain, setSubmittingQuestChain] = useState(false);

  const onSubmitQuestChain = useCallback(
    async ({ name, description }: { name: string; description: string }) => {
      if (
        !chainId ||
        !questChain ||
        !provider ||
        chainId !== questChain.chainId
      )
        return;
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
    <VStack w="100%" px={{ base: 0, md: 12, lg: 40 }}>
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
      <Fade in={visible}>
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

        <Flex flexDirection="column" w="100%" justify="center" zIndex="10">
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
            direction={{ base: 'column', md: 'row' }}
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
                  </>
                )}
              </Flex>

              <Flex
                flexDirection="column-reverse"
                maxW={373}
                display={{ base: 'flex', md: 'none' }}
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

              {/* Quest Chain Description */}
              <Flex mb={8}>
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

              {/* Quest Chain Metadata */}
              <Flex mb={8} justifyContent="space-between" gap={1}>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    TOTAL PLAYERS
                  </Text>
                  <Text>{questChain.numQuesters}</Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    PLAYERS FINISHED
                  </Text>
                  <Text>{questChain.numCompletedQuesters}</Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    QUESTS
                  </Text>
                  <Text>{questChain.quests.length}</Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    DATE CREATED
                  </Text>
                  <Text>
                    {new Date(questChain.createdAt * 1000).toLocaleDateString(
                      'en-US',
                    )}
                  </Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="xs">
                    CREATED BY
                  </Text>
                  {questChain.createdBy.id && (
                    <UserDisplay address={questChain.createdBy.id} />
                  )}
                </Box>
              </Flex>

              {/* Actions */}
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
                {mode === Mode.MEMBER && (
                  <Flex
                    w="full"
                    bgColor="rgba(29, 78, 216, 0.3)"
                    p={6}
                    borderRadius={3}
                    justifyContent="space-between"
                  >
                    <Flex justifyContent="center" alignItems="center">
                      <InfoIcon mr={2} color="#3B82F6" />3 proof submissions are
                      awaiting review Description
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
                      {mode === Mode.MEMBER && (isAdmin || isEditor) && (
                        <Button onClick={onOpenCreateQuest} fontSize="xs">
                          <AddIcon fontSize="sm" mr={2} />
                          Create Quest
                        </Button>
                      )}
                    </Flex>

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
                            questChain={questChain}
                            refresh={refresh}
                            onClose={onCloseCreateQUest}
                          />
                        </ModalBody>
                      </ModalContent>
                    </Modal>

                    {/* would be really nice if this was refactored by 
                  separating the whole quest actions logic into its own component, so:
                  - edit quest
                  - upload proof */}
                    <Accordion allowMultiple w="full" defaultIndex={[]}>
                      {questChain.quests.map(
                        ({ name, description, questId, paused }, index) =>
                          name &&
                          description && (
                            <>
                              {!(isEditingQuest && questEditId === questId) && (
                                <Quest
                                  key={questId}
                                  name={`${index + 1}. ${name}`}
                                  description={description}
                                  bgColor={
                                    userStatus[questId]?.status === 'pass'
                                      ? 'main.300'
                                      : userStatus[questId]?.status === 'review'
                                      ? '#EFFF8F30'
                                      : 'whiteAlpha.100'
                                  }
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
                            </>
                          ),
                      )}
                    </Accordion>
                  </>
                )}
              </VStack>
            </Flex>

            {/* Right */}
            <Flex flexDirection="column" maxW={373}>
              <Flex
                flexDirection="column"
                maxW={373}
                display={{ base: 'none', md: 'flex' }}
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
    </VStack>
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
        <Flex justifyContent="space-between" h={124}>
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
        mb={14}
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
    <Flex justify="space-between" alignItems="center" my={3} pl={4}>
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
  <Flex flexDir="column" px={5} width="full">
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

  let questChain = null;
  if (address && chainId) {
    try {
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
    },
    revalidate: 1,
  };
};

export default QuestChainPage;
