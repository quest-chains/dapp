import { EditIcon, WarningIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  HStack,
  IconButton,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { PowerIcon } from '@/components/icons/PowerIcon';
import { TrashOutlinedIcon } from '@/components/icons/TrashOutlinedIcon';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { UploadProofButton } from '@/components/UploadProofButton';
import { UserStatusType } from '@/hooks/useUserStatus';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { ConfirmationModal } from './ConfirmationModal';
import { QuestAdvSetting } from './CreateChain/QuestsForm';

export const QuestTile: React.FC<{
  name: string;
  description: string;
  onRemoveQuest?: () => void;
  onEditQuest: () => void;
  isMember?: boolean;
  bgColor?: string;
  questId?: string;
  userStatus?: UserStatusType;
  questChain?: graphql.QuestChainInfoFragment;
  refresh?: () => void;
  advSettings?: QuestAdvSetting;
  onTogglePause?: (questId: string, pause: boolean) => void;
  editDisabled?: boolean;
  pauseDisabled?: boolean;
}> = ({
  name,
  description,
  onRemoveQuest,
  onEditQuest,
  isMember = true,
  bgColor = 'gray.900',
  questId,
  userStatus,
  questChain,
  refresh,
  advSettings = { paused: false, optional: false, skipReview: false },
  editDisabled = false,
  pauseDisabled = true,
  onTogglePause,
}) => {
  const { chainId, provider } = useWallet();
  const [isToggling, setToggling] = useState(false);
  const {
    isOpen: isRemoveModalOpen,
    onClose: onRemoveModalClose,
    onOpen: onRemoveModalOpen,
  } = useDisclosure();

  const toggleQuestPaused = useCallback(
    async (pause: boolean) => {
      if (!chainId || !provider || !questChain || !questId) {
        return;
      }

      setToggling(true);
      let tid = toast.loading(`${pause ? 'Disabling' : 'Enabling'} the quest`);
      try {
        const contract = getQuestChainContract(
          questChain.address,
          questChain.version,
          provider.getSigner(),
        );

        const tx = await (Number(questChain.version) > 0
          ? (contract as contracts.V1.QuestChain).pauseQuests(
              [questId],
              [pause],
            )
          : (contract as contracts.V0.QuestChain).functions[
              pause ? 'pauseQuest' : 'unpauseQuest'
            ](questId));
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
          `Successfully ${pause ? 'disabled' : 'enabled'} the quest`,
        );
        refresh?.();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      } finally {
        setToggling(false);
      }
    },
    [chainId, provider, questChain, questId, refresh],
  );

  const { optional, skipReview, paused } = advSettings;

  return (
    <AccordionItem bg={bgColor} borderRadius={10} mb={3} border={0} w="100%">
      {({ isExpanded }) => (
        <>
          <Flex
            alignItems="center"
            gap={1}
            pr={
              isMember && (!editDisabled || !pauseDisabled || onRemoveQuest)
                ? 2
                : 0
            }
          >
            <AccordionButton
              py={3.5}
              _hover={{ bgColor: 'whiteAlpha.200' }}
              borderRadius={8}
              pl={
                isMember && (!editDisabled || !pauseDisabled || onRemoveQuest)
                  ? 5
                  : 4
              }
            >
              <VStack
                flex={1}
                align="stretch"
                justify="start"
                spacing={0}
                py={optional || skipReview ? 0 : 2.5}
              >
                <Flex textAlign="left" gap={2}>
                  <Text
                    display="-webkit-box"
                    fontWeight="bold"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    maxW="calc(100%)"
                    sx={
                      isExpanded
                        ? {}
                        : {
                            lineClamp: 1,
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }
                    }
                  >
                    {name}
                  </Text>
                  {paused && (
                    <Tag colorScheme="orange" fontSize="xs">
                      <WarningIcon boxSize=".75rem" mr={1} />
                      Disabled
                    </Tag>
                  )}
                </Flex>
                {(optional || skipReview) && (
                  <HStack spacing={1} fontSize="sm" color="whiteAlpha.600">
                    {optional && <Text as="span">optional</Text>}
                    {optional && skipReview && <Text as="span">·</Text>}
                    {skipReview && <Text as="span">auto review</Text>}
                  </HStack>
                )}
              </VStack>
              <AccordionIcon ml={4} />
            </AccordionButton>
            {isMember && (
              <>
                {!editDisabled && (
                  <Tooltip label="Edit Quest">
                    <IconButton
                      icon={<EditIcon />}
                      onClick={onEditQuest}
                      aria-label=""
                      bg="transparent"
                    />
                  </Tooltip>
                )}

                {/* Only show for version lesser than 2 */}
                {Number(questChain?.version) < 2 &&
                  !pauseDisabled &&
                  questId && (
                    <Tooltip label={paused ? 'Enable Quest' : 'Disable Quest'}>
                      <IconButton
                        aria-label=""
                        bg={!paused ? 'transparent' : 'whiteAlpha.200'}
                        isLoading={isToggling}
                        onClick={() =>
                          onTogglePause
                            ? onTogglePause(questId, !paused)
                            : toggleQuestPaused(!paused)
                        }
                        icon={<PowerIcon />}
                      />
                    </Tooltip>
                  )}
                {onRemoveQuest && (
                  <Tooltip label="Delete Quest">
                    <IconButton
                      icon={<TrashOutlinedIcon />}
                      onClick={onRemoveModalOpen}
                      aria-label=""
                      bg="transparent"
                    />
                  </Tooltip>
                )}
              </>
            )}
          </Flex>
          <AccordionPanel px={6}>
            <MarkdownViewer markdown={description} />
            {questId && userStatus && questChain && refresh && !isMember && (
              <UploadProofButton
                questId={questId}
                name={name}
                questChain={questChain}
                userStatus={userStatus}
                refresh={refresh}
              />
            )}
          </AccordionPanel>
          {isExpanded && <ReviewComment {...{ userStatus, questId }} />}
          <ConfirmationModal
            title={`Deleting Quest - ${name}`}
            content="Are you sure you want to delete this quest?"
            isOpen={isRemoveModalOpen}
            onClose={onRemoveModalClose}
            onSubmit={() => {
              onRemoveQuest?.();
              onRemoveModalClose();
            }}
            submitLabel="Delete"
          />
        </>
      )}
    </AccordionItem>
  );
};

const ReviewComment: React.FC<{
  userStatus?: UserStatusType;
  questId?: string;
}> = ({ userStatus, questId }) => {
  if (
    !questId ||
    !userStatus ||
    !userStatus[questId] ||
    userStatus[questId].status === graphql.Status.Init ||
    userStatus[questId].status === graphql.Status.Review ||
    userStatus[questId].reviews.length === 0
  )
    return null;

  const reviewComment =
    userStatus[questId].reviews[userStatus[questId].reviews.length - 1]
      .description;

  if (!reviewComment) return null;

  return (
    <Flex
      w="100%"
      p={6}
      mt={4}
      background="linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), #1A202C"
      role="group"
      position="relative"
      flexDirection="column"
      gap="4"
    >
      <MarkdownViewer markdown={reviewComment ?? ''} />
    </Flex>
  );
};
