import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
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
import { Signer } from 'ethers';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import Edit from '@/assets/Edit.svg';
import { CollapsableQuestDisplay } from '@/components/CollapsableQuestDisplay';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { AddQuestBlock } from '@/components/CreateQuest/AddQuestBlock';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { MintNFTTile } from '@/components/MintNFTTile';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { QuestChainPauseStatus } from '@/components/QuestChainPauseStatus';
import { QuestEditor } from '@/components/QuestEditor';
import { Role } from '@/components/RoleTag';
import { UserDisplay } from '@/components/UserDisplay';
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
import { Metadata, uploadMetadataViaAPI } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { SUPPORTED_NETWORK_INFO, useWallet } from '@/web3';

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
    status: Status;
  };
};

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

  const [mode, setMode] = useState(isUser ? 'QUESTER' : 'MEMBER');

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
      Object.values(userStatus).length > 0 &&
      Object.values(userStatus).reduce(
        (t, v) => t && v.status === Status.Pass,
        true,
      ),
    [questChain, address, userStatus],
  );

  const fetching = fetchingStatus || fetchingQuests;

  const refresh = useCallback(() => {
    refreshStatus();
    refreshQuests();
  }, [refreshQuests, refreshStatus]);

  const contract: QuestChain = QuestChain__factory.connect(
    questChain?.address ?? ZERO_ADDRESS,
    provider?.getSigner() as Signer,
  );

  const [isSubmittingQuestChain, setSubmittingQuestChain] = useState(false);

  const onSubmitQuestChain = useCallback(
    async ({ name, description }: { name: string; description: string }) => {
      if (!chainId || chainId !== questChain?.chainId) return;
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
    [contract, refresh, chainId, questChain],
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
    <VStack w="100%" px={{ base: 0, lg: 40 }}>
      <Box
        bgImage={ipfsUriToHttp(questChain.imageUrl)}
        position="fixed"
        height="150%"
        top="-200px"
        width="150%"
        opacity="0.05"
        bgPos="top"
        bgSize="cover"
      />
      <Fade in={visible}>
        <Head>
          <title>
            {questChain.name} -{' '}
            {SUPPORTED_NETWORK_INFO[questChain.chainId].name}
          </title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>

        <Flex flexDirection="column" w="100%" justify="center" zIndex="10">
          {questChain.paused && (
            <Alert status="warning" borderRadius="md" mb={6}>
              <AlertIcon />
              <AlertTitle>Quest Chain is disabled!</AlertTitle>
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
                onClick={() => setMode('QUESTER')}
                bgColor={mode === 'QUESTER' ? 'main.200' : 'whiteAlpha.100'}
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
                onClick={() => setMode('MEMBER')}
                bgColor={mode === 'MEMBER' ? 'main.200' : 'whiteAlpha.100'}
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
          <Flex gap={10} justifyContent="space-between">
            {/* Left */}
            <Flex flexDirection="column" w="full">
              {/* Quest Chain Title */}
              <Flex justifyContent="space-between" w="full">
                {!isEditingQuestChain && (
                  <Flex flexDirection="column" mb={8}>
                    <Text
                      fontSize="6xl"
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
              <Flex mb={8} justifyContent="space-between">
                <Box>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    TOTAL PLAYERS
                  </Text>
                  <Text>{questChain.numQuesters}</Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    PLAYERS FINISHED
                  </Text>
                  <Text>{questChain.numCompletedQuesters}</Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    QUESTS
                  </Text>
                  <Text>{questChain.quests.length}</Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    DATE CREATED
                  </Text>
                  <Text>
                    {new Date(questChain.createdAt * 1000).toLocaleDateString(
                      'en-US',
                    )}
                  </Text>
                </Box>
                <Box>
                  <Text color="whiteAlpha.600" fontSize="sm">
                    CREATED BY
                  </Text>
                  <UserDisplay address={questChain.createdBy.id} ghost />
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
                    w={`${(progress.completeCount / progress.total) * 100}%`}
                  />
                  <Box
                    bgColor="pending"
                    w={`${(progress.inReviewCount / progress.total) * 100}%`}
                  />
                  <Box bgColor="grey" h={2} />
                </Flex>
                <Text>
                  {`${Math.round(
                    (progress.completeCount / progress.total) * 100,
                  )}%`}
                </Text>
              </Flex>
              <Flex>
                {mode === 'QUESTER' &&
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
                  )}
                {mode === 'MEMBER' && (
                  <NextLink
                    as={`/chain/${questChain.chainId}/${questChain.address}/review`}
                    href={`/chain/[chainId]/[address]/review`}
                    passHref
                  >
                    <ChakraLink display="block" _hover={{}}>
                      <Button
                        borderWidth={1}
                        borderColor="white"
                        px={12}
                        py={2}
                        borderRadius="full"
                      >
                        REVIEW SUBMISSIONS
                      </Button>
                    </ChakraLink>
                  </NextLink>
                )}

                {/* Mint Tile */}
                {canMint && (
                  <Flex pt={6} w="100%">
                    <MintNFTTile
                      {...{
                        address: questChain.address,
                        chainId: questChain.chainId,
                        name: questChain.name,
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
                    <Flex justifyContent="space-between" w="full">
                      <Text w="full" fontSize={40} fontFamily="heading">
                        QUESTS
                      </Text>
                      {mode === 'MEMBER' && (isAdmin || isEditor) && (
                        <Button
                          variant="ghost"
                          onClick={onOpenCreateQuest}
                          fontSize="xs"
                        >
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
                    {questChain.quests.map((quest, index) => (
                      <Flex
                        w="full"
                        p={8}
                        gap={3}
                        borderRadius={10}
                        align="stretch"
                        bgColor={
                          userStatus[quest.questId]?.status === 'pass'
                            ? 'main.300'
                            : userStatus[quest.questId]?.status === 'review'
                            ? '#EFFF8F30'
                            : 'whiteAlpha.100'
                        }
                        key={quest.questId}
                        justifyContent="space-between"
                        position="relative"
                      >
                        {!(isEditingQuest && questEditId === quest.questId) && (
                          <>
                            {index + 1}.
                            <Flex justifyContent="space-between" w="full">
                              <CollapsableQuestDisplay
                                {...quest}
                                address={address}
                                questChainAddress={questChain.address}
                                chainId={questChain.chainId}
                                userStatus={userStatus}
                                refresh={refresh}
                              />
                              {mode === 'MEMBER' && (isAdmin || isEditor) && (
                                <Button
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingQuest(true);
                                    setQuestEditId(quest.questId);
                                  }}
                                  fontSize="xs"
                                  position="absolute"
                                  right={20}
                                  margin={0}
                                  top={6}
                                >
                                  <Image src={Edit.src} alt="Edit" mr={3} />
                                  Edit
                                </Button>
                              )}
                            </Flex>
                          </>
                        )}

                        {/* Edit quest components */}
                        {isEditingQuest && questEditId === quest.questId && (
                          <QuestEditor
                            refresh={refresh}
                            questChainId={questChain.chainId}
                            questChainAddress={questChain.address}
                            quest={quest}
                            setEditingQuest={setEditingQuest}
                          />
                        )}
                      </Flex>
                    ))}
                  </>
                )}
              </VStack>
            </Flex>

            {/* Right */}
            <Flex flexDirection="column" maxW={373}>
              {/* Actions */}
              {mode === 'MEMBER' && ((isAdmin && chainId) || isOwner) && (
                <Flex justifyContent="space-between" h={124}>
                  {isAdmin && chainId === questChain.chainId && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditingQuestChain(true);
                        setChainName(questChain.name || '');
                      }}
                      fontSize="xs"
                    >
                      <Image src={Edit.src} alt="Edit" mr={2} />
                      Edit Metadata
                    </Button>
                  )}
                  {isOwner && (
                    <QuestChainPauseStatus
                      questChain={questChain}
                      refresh={refresh}
                    />
                  )}
                </Flex>
              )}

              {/* Image (Should be NFT) */}
              {questChain.imageUrl && (
                <Image
                  src={ipfsUriToHttp(questChain.imageUrl)}
                  alt="Cover Image"
                  borderRadius={8}
                  outline="1px solid #FFFFFF30"
                  mb={14}
                />
              )}

              {/* Quest Chain Members */}
              <Flex flexDir="column" px={5}>
                <Text fontFamily="heading" fontSize="xl" mb={5}>
                  Members
                </Text>
                <Divider />
                <MemberSection role="OWNERS" addresses={owners} />
                {admins.length !== 0 && (
                  <MemberSection role="ADMINS" addresses={admins} />
                )}
                {editors.length !== 0 && (
                  <MemberSection role="EDITORS" addresses={editors} />
                )}
                {reviewers.length !== 0 && (
                  <MemberSection role="REVIEWERS" addresses={reviewers} />
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Fade>
    </VStack>
  );
};

type RolesProps = {
  role: string;
  addresses: string[];
};

const MemberSection: React.FC<RolesProps> = ({ role, addresses }) => (
  <>
    <Flex justify="space-between" alignItems="center" my={3} pl={4}>
      <Text color="whiteAlpha.600">{role}</Text>
      <Flex flexDir="column">
        {addresses.map(address => (
          <Box key={address}>
            <UserDisplay address={address} />
          </Box>
        ))}
      </Flex>
    </Flex>
    <Divider />
  </>
);

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
