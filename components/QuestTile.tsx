import { EditIcon, SmallCloseIcon, WarningIcon } from '@chakra-ui/icons';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  IconButton,
  Tag,
  Text,
  Tooltip,
  Wrap,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownViewer } from '@/components/MarkdownViewer';
import { UserStatusType } from '@/pages/chain/[chainId]/[address]';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { PowerIcon } from './icons/PowerIcon';
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
  isCreatingChain?: boolean;
  isPaused?: boolean;
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
  isCreatingChain = false,
  isPaused = false,
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
    <AccordionItem
      bg={bgColor}
      borderRadius={10}
      px={4}
      mb={3}
      border={0}
      w="100%"
    >
      <Flex alignItems="center">
        <AccordionButton py={6}>
          <Flex flex="1" textAlign="left" gap={2}>
            <Text fontWeight="bold" whiteSpace="nowrap">
              {name}
            </Text>
            {isPaused && (
              <Tag colorScheme="orange" fontSize="xs">
                <WarningIcon boxSize=".75rem" mr={1} />
                Disabled
              </Tag>
            )}
          </Flex>
          <AccordionIcon ml={4} />
        </AccordionButton>
        {isMember && (
          <>
            {isCreatingChain && (
              <Tooltip label="Delete Quest">
                <IconButton
                  icon={<SmallCloseIcon />}
                  onClick={onRemoveQuest}
                  aria-label=""
                  bg="transparent"
                />
              </Tooltip>
            )}
            <Tooltip label="Edit Quest">
              <IconButton
                icon={<EditIcon />}
                onClick={onEditQuest}
                aria-label=""
                bg="transparent"
              />
            </Tooltip>
          </>
        )}
      </Flex>
      <AccordionPanel>
        <MarkdownViewer markdown={description} />
        <Wrap align="center" mt={4} spacing={4}>
          {questId && userStatus && questChain && refresh && !isMember && (
            <UploadProofButton
              questId={questId}
              name={name}
              questChain={questChain}
              userStatus={userStatus}
              refresh={refresh}
            />
          )}
          {questChain && questId && isMember && (
            <Button
              colorScheme={isPaused ? 'green' : 'orange'}
              variant="outline"
              size="sm"
              ml="auto"
              isLoading={isToggling}
              isDisabled={chainId !== questChain.chainId}
              onClick={() => toggleQuestPaused(!isPaused)}
              leftIcon={<PowerIcon />}
            >
              {isPaused ? 'Enable Quest' : 'Disable Quest'}
            </Button>
          )}
        </Wrap>
      </AccordionPanel>
    </AccordionItem>
  );
};
