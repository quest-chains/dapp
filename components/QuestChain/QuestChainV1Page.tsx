import { CopyIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Fade,
  Flex,
  Image,
  Input,
  Link as ChakraLink,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useTimeout,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { TwitterShareButton } from 'react-share';

import { ConfirmationModal } from '@/components/ConfirmationModal';
import { Page } from '@/components/Layout/Page';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { MastodonShareButton } from '@/components/MastodonShareButton';
import { MembersDisplay } from '@/components/MembersDisplay';
import { MintNFTTile } from '@/components/MintNFTTile';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { QuestTile } from '@/components/QuestTile';
import { Role } from '@/components/RoleTag';
import { HeadComponent } from '@/components/Seo';
import { SubmitButton } from '@/components/SubmitButton';
import { UserDisplay } from '@/components/UserDisplay';
import { useDropImage } from '@/hooks/useDropFiles';
import { useInputText } from '@/hooks/useInputText';
import { usePoHs } from '@/hooks/usePoH';
import { useToggleQuestChainPauseStatus } from '@/hooks/useToggleQuestChainPauseStatus';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useUserStatus } from '@/hooks/useUserStatus';
import { QUESTCHAINS_URL } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { AVAILABLE_NETWORK_INFO, formatAddress, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import NFTForm from '../CreateChain/NFTForm';
import { AwardIcon } from '../icons/AwardIcon';
import { EditIcon } from '../icons/EditIcon';
import { PowerIcon } from '../icons/PowerIcon';
import { TwitterIcon } from '../icons/TwitterIcon';
import { UploadImageForm } from '../UploadImageForm';
import { QuestsEditor } from './QuestsEditor';
import { RolesEditor } from './RolesEditor';

const { Status } = graphql;

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

export type QuestChainV1PageProps = {
  questChain: graphql.QuestChainInfoFragment;
  questStatuses: graphql.QuestStatusInfoFragment[];
  fetching: boolean;
  refresh: () => void;
};

export const QuestChainV1Page: React.FC<QuestChainV1PageProps> = ({
  questChain,
  questStatuses,
  fetching,
  refresh,
}) => {
  const { address, chainId, provider } = useWallet();
  const [visible, setVisible] = useState(false);

  useTimeout(() => {
    setVisible(true);
  }, 1000);

  const userStatus = useUserStatus(questStatuses, address ?? '');

  const numSubmissionsToReview = questStatuses.filter(
    q => q.status === graphql.Status.Review,
  ).length;

  const { progress, canMint } = useUserProgress(
    address,
    questChain,
    userStatus,
  );

  const {
    isOpen: isUpdateQuestChainConfirmationOpen,
    onOpen: onUpdateQuestChainConfirmationOpen,
    onClose: onUpdateQuestChainConfirmationClose,
  } = useDisclosure();

  const {
    isOpen: isNFTModalOpen,
    onOpen: onNFTModalOpen,
    onClose: onNFTModalClose,
  } = useDisclosure();

  const [isEditingQuestChain, setEditingQuestChain] = useState(false);
  const [hasMetadataChanged, setMetadataChanged] = useState(false);

  const [isEditingQuests, setEditingQuests] = useState(false);

  const [chainNameRef, setChainName] = useInputText(questChain?.name || '');
  const [chainDescRef, setChainDescription] = useInputText(
    questChain?.description || '',
  );

  const uploadImageProps = useDropImage();
  const { imageFile, onResetImage } = uploadImageProps;
  const [removeCoverImage, setRemoveCoverImage] = useState(false);

  const [isEditingMembers, setEditingMembers] = useState(false);

  const [isEditingNFT, setEditingNFT] = useState(false);
  const {
    isOpen: isEditNFTOpen,
    onOpen: onEditNFTOpen,
    onClose: onEditNFTClose,
  } = useDisclosure();

  const checkMetadataChanged = useCallback(() => {
    if (
      hasMetadataChanged &&
      chainNameRef.current === questChain.name &&
      chainDescRef.current === questChain.description
    ) {
      setMetadataChanged(false);
    } else if (
      !hasMetadataChanged &&
      !(
        chainNameRef.current === questChain.name &&
        chainDescRef.current === questChain.description
      )
    ) {
      setMetadataChanged(true);
    }
  }, [
    hasMetadataChanged,
    chainNameRef,
    questChain.name,
    questChain.description,
    chainDescRef,
  ]);

  useEffect(
    () =>
      setMetadataChanged(
        !!imageFile || (removeCoverImage && !!questChain.imageUrl),
      ),
    [imageFile, questChain, removeCoverImage],
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

  const { statuses } = usePoHs(members);

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

  const [isSubmittingQuestChain, setSubmittingQuestChain] = useState(false);

  const router = useRouter();

  const onSubmitQuestChain = useCallback(async () => {
    if (!chainId || !provider || questChain.chainId !== chainId) {
      toast.error(
        `Wrong Chain, please switch to ${
          AVAILABLE_NETWORK_INFO[questChain.chainId].label
        }`,
      );
      return;
    }
    setSubmittingQuestChain(true);
    const metadata: Metadata = {
      name: chainNameRef.current,
      description: chainDescRef.current,
      slug: questChain?.slug || '',
      image_url: removeCoverImage
        ? undefined
        : questChain.imageUrl ?? undefined,
    };
    let tid;
    try {
      if (imageFile) {
        tid = toast.loading('Uploading image to IPFS via web3.storage');
        const imageHash = await uploadFiles([imageFile]);
        metadata.image_url = `ipfs://${imageHash}`;
        toast.dismiss(tid);
      }
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
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
      toast.success(`Successfully updated the quest chain: ${metadata.name}`);

      refresh();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setEditingQuestChain(false);
      setMetadataChanged(false);
      setRemoveCoverImage(false);
      setSubmittingQuestChain(false);
      onResetImage();
    }
  }, [
    chainId,
    provider,
    questChain.chainId,
    questChain.imageUrl,
    questChain.address,
    questChain.version,
    questChain.slug,
    chainNameRef,
    chainDescRef,
    removeCoverImage,
    imageFile,
    refresh,
    onResetImage,
  ]);

  const QCmessage =
    'Level up your Web3 skills by completing a quest chain and earning a soulbound NFT! #QuestChains #NFTs #Web3';
  const QCURL = QUESTCHAINS_URL + router.asPath;

  const [isSavingNFT, setSavingNFT] = useState(false);

  const { togglePause, isTogglingPauseStatus } = useToggleQuestChainPauseStatus(
    questChain,
    refresh,
  );

  const onSubmitNFT = useCallback(
    async (metadataUri: string) => {
      if (!chainId || !provider || questChain?.chainId !== chainId) {
        toast.error(
          `Wrong Chain, please switch to ${
            AVAILABLE_NETWORK_INFO[questChain?.chainId].label
          }`,
        );
        return;
      }
      onEditNFTClose();
      setSavingNFT(true);

      let tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );

      try {
        const contract = getQuestChainContract(
          questChain.address,
          questChain.version,
          provider.getSigner(),
        );

        const tx = await (contract as contracts.V1.QuestChain).setTokenURI(
          metadataUri,
        );
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash, chainId);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully edited the NFT');
        refresh();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      } finally {
        setSavingNFT(false);
        setEditingNFT(false);
      }
    },
    [refresh, questChain, chainId, provider, onEditNFTClose],
  );

  const copyToClipboard = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  }, []);

  return (
    <Page>
      <HeadComponent
        title={questChain.name || 'Quest Chains'}
        description={
          questChain.description ||
          'Complete this quest chain to acquire its soulbound NFT!'
        }
        url={QCURL}
      />
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
              <AlertTitle>Quest chain is disabled.</AlertTitle>
            </Alert>
          )}

          {/* Set Mode  */}
          {(isAdmin || isEditor || isReviewer) && !isEditingQuestChain && (
            <Flex
              mb={14}
              bgColor={(() => {
                if (mode === Mode.QUESTER) return '#121F33';
                if (isEditingNFT || isEditingMembers || isEditingQuests)
                  return '#182B29';
                return '#1D1121';
              })()}
              boxShadow="0px 0px 16px 4px rgba(0, 0, 0, 0.12)"
              borderRadius={8}
              alignItems="center"
              px={6}
              py={4}
              zIndex={100}
              w="100%"
              fontSize="sm"
              minH="4.5rem"
            >
              {mode === Mode.QUESTER ? (
                <Flex gap="0.5rem" fontWeight="600">
                  <Text>You are viewing this quest chain as a quester.</Text>
                  <Text
                    color="main"
                    cursor="pointer"
                    borderBottom="1px solid"
                    borderBottomColor="main"
                    _hover={{ borderBottomColor: 'white' }}
                    onClick={() => setMode(Mode.MEMBER)}
                  >
                    Switch to member view
                  </Text>
                </Flex>
              ) : (
                <Flex
                  gap="1rem"
                  direction={{ base: 'column', lg: 'row' }}
                  justify="space-between"
                  w="100%"
                  align="center"
                >
                  <Flex
                    gap="0.5rem"
                    direction={{ base: 'column', md: 'row' }}
                    align="center"
                    fontWeight="600"
                  >
                    {(() => {
                      if (isEditingNFT)
                        return (
                          <Text>
                            You are editing the NFT of this quest chain.
                          </Text>
                        );
                      if (isEditingMembers)
                        return (
                          <Text>
                            You are editing the members of this quest chain.
                          </Text>
                        );
                      if (isEditingQuests)
                        return (
                          <Text>
                            You are editing the quests of this quest chain.
                          </Text>
                        );

                      if (isTogglingPauseStatus)
                        return (
                          <Text>
                            You are{' '}
                            {questChain.paused ? 'enabling' : 'disabling'} this
                            quest chain.
                          </Text>
                        );

                      return (
                        <>
                          <Text>
                            You are viewing this quest chain as a member.
                          </Text>
                          <Text
                            color="main"
                            cursor="pointer"
                            borderBottom="1px solid"
                            borderBottomColor="main"
                            _hover={{ borderBottomColor: 'white' }}
                            onClick={() => setMode(Mode.QUESTER)}
                          >
                            Switch to quester view
                          </Text>
                        </>
                      );
                    })()}
                  </Flex>
                  {/* Actions */}
                  {chainId &&
                    chainId === questChain.chainId &&
                    isAdmin &&
                    !isEditingQuests &&
                    !isEditingMembers &&
                    !isEditingNFT && (
                      <Flex gap="0.5rem">
                        {!isTogglingPauseStatus && (
                          <Button
                            variant="ghost"
                            bgColor="rgba(71, 85, 105, 0.15)"
                            onClick={() => {
                              setEditingQuestChain(true);
                              setChainName(questChain.name ?? '');
                              setChainDescription(questChain.description ?? '');
                            }}
                            fontSize="xs"
                            leftIcon={<EditIcon fontSize="sm" />}
                          >
                            Edit chain metadata
                          </Button>
                        )}
                        <Button
                          onClick={togglePause}
                          isLoading={isTogglingPauseStatus}
                          variant="ghost"
                          bgColor="rgba(71, 85, 105, 0.15)"
                          fontSize="xs"
                          leftIcon={<PowerIcon fontSize="sm" />}
                        >
                          {questChain.paused
                            ? 'Enable quest chain'
                            : 'Disable quest chain'}
                        </Button>
                      </Flex>
                    )}
                </Flex>
              )}
            </Flex>
          )}
          {isEditingQuestChain && (
            <Flex
              mb={14}
              bgColor="#182B29"
              boxShadow="0px 0px 16px 4px rgba(0, 0, 0, 0.12)"
              borderRadius={8}
              alignItems="center"
              px={6}
              py={4}
              zIndex={100}
              w="100%"
              fontSize="sm"
              minH="4.5rem"
              justify="space-between"
              direction={{ base: 'column', lg: 'row' }}
              gap="1rem"
            >
              {hasMetadataChanged ? (
                <Text>
                  You have made changes to this quest chain. Would you like to
                  save them?{' '}
                </Text>
              ) : (
                <Text>You are editing this quest chain.</Text>
              )}
              <Flex gap="0.5rem" direction={{ base: 'column', md: 'row' }}>
                {hasMetadataChanged && (
                  <SubmitButton
                    fontSize="sm"
                    px={6}
                    height={10}
                    onClick={() => {
                      if (!provider || chainId !== questChain.chainId) {
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
                      onUpdateQuestChainConfirmationOpen();
                    }}
                    isLoading={isSubmittingQuestChain}
                    w="12.5rem"
                  >
                    Save changes
                  </SubmitButton>
                )}
                <SubmitButton
                  fontSize="sm"
                  bg="transparent"
                  height={10}
                  border="1px solid #9EFCE5"
                  color="#9EFCE5"
                  onClick={() => {
                    setEditingQuestChain(false);
                    onResetImage();
                    setRemoveCoverImage(false);
                    setMetadataChanged(false);
                  }}
                  isDisabled={isSubmittingQuestChain}
                  _hover={{
                    bg: 'whiteAlpha.200',
                  }}
                  px={6}
                  w="12.5rem"
                >
                  {hasMetadataChanged ? 'Exit without saving' : 'Exit'}
                </SubmitButton>
              </Flex>
            </Flex>
          )}

          {/* quest chain */}
          <Flex
            gap={20}
            justifyContent="space-between"
            direction={{ base: 'column', lg: 'row' }}
          >
            {/* Left */}
            <Flex flexDirection="column" w="full">
              {/* quest chain Title */}
              <Flex justifyContent="space-between" w="full">
                {!isEditingQuestChain && (
                  <Flex flexDirection="column" mb={8} w="full">
                    <Text
                      fontSize="5xl"
                      fontWeight="bold"
                      lineHeight="3.5rem"
                      fontFamily="heading"
                      mb={3}
                    >
                      {questChain.name}
                    </Text>
                    <Flex gap={4} justify="space-between">
                      <NetworkDisplay chainId={questChain.chainId} />
                      <Flex align="center" gap={3}>
                        <TwitterShareButton
                          url={QCURL}
                          title={QCmessage}
                          via="questchainz"
                        >
                          <Button
                            bgColor="#4A99E9"
                            p={4}
                            h={7}
                            leftIcon={<TwitterIcon />}
                          >
                            Tweet
                          </Button>
                        </TwitterShareButton>
                        <MastodonShareButton
                          message={QCmessage + ' ' + QCURL}
                        />
                      </Flex>
                    </Flex>
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
                      isDisabled={isSubmittingQuestChain}
                      onChange={e => {
                        setChainName(e.target.value);
                        checkMetadataChanged();
                      }}
                    />

                    <ConfirmationModal
                      onSubmit={() => {
                        onUpdateQuestChainConfirmationClose();
                        onSubmitQuestChain();
                      }}
                      title="Update quest chain"
                      content="Are you sure you want to update this quest chain?"
                      isOpen={isUpdateQuestChainConfirmationOpen}
                      onClose={onUpdateQuestChainConfirmationClose}
                    />
                  </>
                )}
              </Flex>

              {/* quest chain Description */}
              {!isEditingQuestChain && questChain.description && (
                <Flex mb={8}>
                  <MarkdownViewer markdown={questChain.description} />
                </Flex>
              )}
              {isEditingQuestChain && (
                <>
                  <MarkdownEditor
                    value={chainDescRef.current}
                    isDisabled={isSubmittingQuestChain}
                    onChange={value => {
                      setChainDescription(value);
                      checkMetadataChanged();
                    }}
                  />
                </>
              )}
              {isEditingQuestChain && (
                <Flex mb={8} pt={2}>
                  <UploadImageForm
                    {...uploadImageProps}
                    label="Cover Image (optional)"
                    formControlProps={{
                      w: '100%',
                      position: 'relative',
                    }}
                    imageProps={{
                      maxHeight: '16rem',
                      w: 'auto',
                    }}
                    dropzoneProps={{
                      ...uploadImageProps.dropzoneProps,
                      width: '100%',
                      height: '16rem',
                    }}
                    defaultImageUri={ipfsUriToHttp(questChain.imageUrl)}
                    onResetDefaultImage={() => setRemoveCoverImage(true)}
                    isDisabled={isSubmittingQuestChain}
                  />
                </Flex>
              )}

              <Flex
                direction="column"
                display={{ base: 'flex', lg: 'none' }}
                align="center"
                w="100%"
                mb={8}
              >
                {questChain.token.imageUrl && (
                  <Flex
                    align="center"
                    justify="center"
                    maxW="min(373px, 100%)"
                    maxH="min(373px, 100%)"
                    borderRadius={8}
                    overflow="hidden"
                  >
                    <Image
                      src={ipfsUriToHttp(questChain.token.imageUrl)}
                      alt="quest chain NFT badge"
                      maxW={373}
                      maxH={373}
                    />
                    Here
                  </Flex>
                )}

                {isAdmin &&
                  mode === Mode.MEMBER &&
                  !isTogglingPauseStatus &&
                  !isEditingMembers &&
                  !isEditingQuests &&
                  !isEditingQuestChain && (
                    <Button
                      onClick={() => {
                        setEditingNFT(true);
                        onEditNFTOpen();
                      }}
                      w="100%"
                      mt={6}
                      isLoading={isSavingNFT}
                      leftIcon={<AwardIcon />}
                    >
                      Edit NFT
                    </Button>
                  )}
              </Flex>

              {/* quest chain Metadata */}
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
                <Flex w="full" h={6} alignItems="center" mb={6}>
                  <Flex
                    flex={1}
                    border="1px solid white"
                    borderRadius={5}
                    h={3}
                  >
                    <Flex
                      w="100%"
                      h="100%"
                      border="1px solid transparent"
                      borderRadius={3}
                      position="relative"
                    >
                      <Box
                        position="absolute"
                        left={0}
                        top={0}
                        h="100%"
                        bgColor="white"
                        opacity={0.5}
                        w={`${
                          (progress.total
                            ? (progress.completeCount +
                                progress.inReviewCount) /
                              progress.total
                            : 0) * 100
                        }%`}
                        borderRadius={3}
                      >
                        {progress.inReviewCount > 0 && (
                          <Text
                            position="absolute"
                            top="200%"
                            right="0%"
                            fontSize="xs"
                          >
                            {progress.inReviewCount} pending
                          </Text>
                        )}
                      </Box>
                      <Box
                        position="absolute"
                        left={0}
                        top={0}
                        h="100%"
                        bgColor="white"
                        w={`${
                          (progress.total
                            ? progress.completeCount / progress.total
                            : 0) * 100
                        }%`}
                        borderRadius={3}
                      >
                        {progress.completeCount > 0 && (
                          <Text
                            position="absolute"
                            top="200%"
                            right="0%"
                            fontSize="xs"
                          >
                            {progress.completeCount} accepted
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Flex>
                  <Box position="relative" w="4rem">
                    <Text textAlign="right">
                      {`${Math.round(
                        (progress.total
                          ? progress.completeCount / progress.total
                          : 0) * 100,
                      )}%`}
                    </Text>
                    <Text
                      position="absolute"
                      top="100%"
                      right="0%"
                      fontSize="xs"
                    >
                      completed
                    </Text>
                  </Box>
                </Flex>
              )}
              <Flex mb={12}>
                {mode === Mode.MEMBER &&
                  isReviewer &&
                  !isEditingQuestChain &&
                  !isEditingQuests &&
                  !isEditingMembers &&
                  !isTogglingPauseStatus &&
                  !isEditingNFT && (
                    <Flex
                      w="full"
                      bgColor="rgba(29, 78, 216, 0.3)"
                      p={6}
                      borderRadius={8}
                      justifyContent="space-between"
                    >
                      <Flex justifyContent="center" alignItems="center">
                        <InfoIcon boxSize={'1.25rem'} mr={2} color="#3B82F6" />
                        {numSubmissionsToReview > 0
                          ? `${numSubmissionsToReview} submissions are awaiting review`
                          : 'There are no submissions that are awaiting review'}
                      </Flex>
                      {numSubmissionsToReview > 0 && (
                        <NextLink
                          as={`/${
                            AVAILABLE_NETWORK_INFO[questChain.chainId].urlName
                          }/${questChain.address}/review`}
                          href={`/${
                            AVAILABLE_NETWORK_INFO[questChain.chainId].urlName
                          }/[address]/review`}
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
                      )}
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
                        QCURL,
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
                      {mode === Mode.MEMBER &&
                        isEditor &&
                        !isTogglingPauseStatus &&
                        !isEditingQuestChain &&
                        !isEditingQuests &&
                        !isEditingMembers &&
                        !isEditingNFT && (
                          <Button
                            onClick={() => setEditingQuests(e => !e)}
                            fontSize="xs"
                            leftIcon={<EditIcon fontSize="sm" />}
                          >
                            Edit quests
                          </Button>
                        )}
                    </Flex>

                    {isEditingQuests ? (
                      <QuestsEditor
                        refresh={refresh}
                        questChain={questChain}
                        onExit={() => setEditingQuests(false)}
                      />
                    ) : (
                      <Accordion allowMultiple w="full" defaultIndex={[]}>
                        {questChain.quests
                          .filter(
                            q =>
                              !!q.name && (mode === Mode.MEMBER || !q.paused),
                          )
                          .map(
                            ({ name, description, questId, paused }, index) => (
                              <QuestTile
                                key={questId}
                                name={`${index + 1}. ${name}`}
                                description={description ?? ''}
                                bgColor={getQuestBGColor(
                                  userStatus[questId]?.status,
                                  mode,
                                )}
                                onEditQuest={() => undefined}
                                isMember={
                                  mode === Mode.MEMBER && (isAdmin || isEditor)
                                }
                                questId={questId}
                                questChain={questChain}
                                userStatus={userStatus}
                                isPaused={paused}
                                refresh={refresh}
                                editDisabled
                              />
                            ),
                          )}
                      </Accordion>
                    )}
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
                mb={12}
              >
                {questChain.token.imageUrl && (
                  <Flex
                    align="center"
                    justify="center"
                    maxW="min(373px, 100%)"
                    maxH="min(373px, 100%)"
                    borderRadius={8}
                    overflow="hidden"
                  >
                    <Image
                      src={ipfsUriToHttp(questChain.token.imageUrl)}
                      alt="quest chain NFT badge"
                      maxW={373}
                      maxH={373}
                      onClick={onNFTModalOpen}
                      cursor="pointer"
                    />
                  </Flex>
                )}
                <Modal isOpen={isNFTModalOpen} onClose={onNFTModalClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{questChain.token?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Flex mb={3} alignItems="start" direction="column">
                        <Flex
                          w="full"
                          gap={4}
                          mb={2}
                          justifyContent="space-between"
                        >
                          <NetworkDisplay chainId={questChain.chainId} asTag />
                        </Flex>
                        <Image
                          src={ipfsUriToHttp(questChain.token.imageUrl)}
                          alt="quest chain NFT badge"
                          maxW="100%"
                          maxH="100%"
                        />
                        <Accordion allowMultiple w="full">
                          <AccordionItem>
                            <AccordionButton>
                              <Box
                                as="span"
                                flex="1"
                                textAlign="left"
                                fontSize={13}
                              >
                                Additional Info
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={1}>
                              <Flex
                                justifyContent="space-between"
                                w="full"
                                alignItems="center"
                              >
                                <Flex fontSize={12}>
                                  Address:{' '}
                                  <Tooltip
                                    label={questChain.token.tokenAddress}
                                  >
                                    <Text fontWeight="bold" ml={2}>
                                      {formatAddress(
                                        questChain.token.tokenAddress,
                                      )}
                                    </Text>
                                  </Tooltip>
                                </Flex>
                                <Button
                                  variant="ghost"
                                  p={0}
                                  onClick={() =>
                                    copyToClipboard(
                                      questChain.token.tokenAddress,
                                    )
                                  }
                                >
                                  <CopyIcon />
                                </Button>
                              </Flex>
                              <Flex
                                justifyContent="space-between"
                                w="full"
                                alignItems="center"
                              >
                                <Flex fontSize={12}>
                                  Id:
                                  <Text fontWeight="bold" ml={2}>
                                    {questChain.token.tokenId}
                                  </Text>
                                </Flex>
                                <Button
                                  variant="ghost"
                                  p={0}
                                  onClick={() =>
                                    copyToClipboard(questChain.token.tokenId)
                                  }
                                >
                                  <CopyIcon />
                                </Button>
                              </Flex>
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      </Flex>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                {isAdmin &&
                  mode === Mode.MEMBER &&
                  !isEditingMembers &&
                  !isEditingQuests &&
                  !isTogglingPauseStatus &&
                  !isEditingQuestChain && (
                    <Button
                      onClick={() => {
                        setEditingNFT(true);
                        onEditNFTOpen();
                      }}
                      w="100%"
                      mt={6}
                      isLoading={isSavingNFT}
                      leftIcon={<AwardIcon />}
                    >
                      Edit NFT
                    </Button>
                  )}
              </Flex>
              {/* quest chain Members */}
              {isEditingMembers && address && isOwner ? (
                <RolesEditor
                  questChain={questChain}
                  members={members}
                  ownerAddress={address}
                  refresh={refresh}
                  onExit={() => setEditingMembers(false)}
                />
              ) : (
                <MembersDisplay
                  owners={owners}
                  admins={admins}
                  editors={editors}
                  reviewers={reviewers}
                  statusesPoH={statuses}
                  onEdit={
                    isOwner &&
                    mode === Mode.MEMBER &&
                    !isEditingNFT &&
                    !isEditingQuests &&
                    !isTogglingPauseStatus &&
                    !isEditingQuestChain
                      ? () => setEditingMembers(true)
                      : undefined
                  }
                />
              )}
            </Flex>
          </Flex>
          {mode === Mode.MEMBER && isAdmin && (
            <Modal
              isOpen={isEditingNFT && isEditNFTOpen}
              onClose={() => {
                onEditNFTClose();
                setEditingNFT(false);
              }}
            >
              <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
              <ModalContent maxW="80rem" p={0} mx={4}>
                <ModalCloseButton />
                <ModalBody p={0}>
                  <NFTForm
                    chainName={questChain.name ?? ''}
                    onSubmit={onSubmitNFT}
                    showStep={false}
                    submitLabel="Submit"
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </Flex>
      </Fade>
    </Page>
  );
};
