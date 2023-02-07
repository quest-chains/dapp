import { EditIcon, InfoIcon, WarningIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  IconButton,
  Tag,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownViewer } from '@/components/MarkdownViewer';
import { UserStatusType } from '@/hooks/useUserStatus';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { PowerIcon } from './icons/PowerIcon';
import { TrashOutlinedIcon } from './icons/TrashOutlinedIcon';
import { UploadProofButton } from './UploadProofButton';

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
  isPaused?: boolean;
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
  isPaused = false,
  editDisabled = false,
  pauseDisabled = true,
  onTogglePause,
}) => {
  const { chainId, provider } = useWallet();
  const [isToggling, setToggling] = useState(false);

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

        const tx = await (questChain.version === '1'
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
              py={5}
              _hover={{ bgColor: 'whiteAlpha.200' }}
              borderRadius={8}
              pl={
                isMember && (!editDisabled || !pauseDisabled || onRemoveQuest)
                  ? 5
                  : 4
              }
            >
              <Flex flex="1" textAlign="left" gap={2}>
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
                {isPaused && (
                  <Tag colorScheme="orange" fontSize="xs">
                    <WarningIcon boxSize=".75rem" mr={1} />
                    Disabled
                  </Tag>
                )}
              </Flex>
              {questId && questChain?.quests[Number(questId)].optional && (
                <Tag colorScheme="green" fontSize="xs">
                  <InfoIcon boxSize=".75rem" mr={1} />
                  Optional
                </Tag>
              )}
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
                {Number(questChain?.version) < 2 && !pauseDisabled && questId && (
                  <Tooltip label={isPaused ? 'Enable Quest' : 'Disable Quest'}>
                    <IconButton
                      aria-label=""
                      bg={!isPaused ? 'transparent' : 'whiteAlpha.200'}
                      isLoading={isToggling}
                      onClick={() =>
                        onTogglePause
                          ? onTogglePause(questId, !isPaused)
                          : toggleQuestPaused(!isPaused)
                      }
                      icon={<PowerIcon />}
                    />
                  </Tooltip>
                )}
                {onRemoveQuest && (
                  <Tooltip label="Delete Quest">
                    <IconButton
                      icon={<TrashOutlinedIcon />}
                      onClick={onRemoveQuest}
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
