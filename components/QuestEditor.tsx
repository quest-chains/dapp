import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Input, useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { QuestChainInfoFragment } from '@/graphql/types';
import { QuestChain as QuestChainV0 } from '@/types/v0';
import { QuestChain as QuestChainV1 } from '@/types/v1';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadata } from '@/utils/metadata';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { ConfirmationModal } from './ConfirmationModal';
import { MarkdownEditor } from './MarkdownEditor';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type QuestEditorProps = {
  refresh: () => void;
  questChain: QuestChainInfoFragment;
  quest: ArrayElement<QuestChainInfoFragment['quests']>;
  setEditingQuest: (sth: boolean) => void;
};

export const QuestEditor: React.FC<QuestEditorProps> = ({
  refresh,
  questChain,
  quest,
  setEditingQuest,
}) => {
  const {
    isOpen: isUpdateQuestConfirmationOpen,
    onOpen: onUpdateQuestConfirmationOpen,
    onClose: onUpdateQuestConfirmationClose,
  } = useDisclosure();
  const [questName, setQuestName] = useState(quest.name);
  const [isSubmittingQuest, setSubmittingQuest] = useState(false);
  const { chainId, provider } = useWallet();

  const [questDescription, setQuestDescription] = useState(quest.description);

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
      if (!chainId || chainId !== questChain.chainId || !provider) {
        toast.error('Wrong Chain, please switch!');
        return;
      }

      setSubmittingQuest(true);
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
          ? (contract as QuestChainV1).editQuests([questId], [details])
          : (contract as QuestChainV0).editQuest(questId, details));
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash, chainId);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
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
    [chainId, questChain, setEditingQuest, provider, refresh],
  );

  return (
    <Flex flexDir="column" bg="gray.900" borderRadius={10} gap={3} mb={3} p={4}>
      <Flex>
        <Input
          mb={3}
          value={questName ?? ''}
          onChange={e => setQuestName(e.target.value)}
          bg="#0F172A"
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
              name: questName ?? '',
              description: questDescription ?? '',
              questId: quest.questId,
            });
          }}
          title="Update Quest"
          content="Are you sure you want to update this quest?"
          isOpen={isUpdateQuestConfirmationOpen}
          onClose={() => {
            onUpdateQuestConfirmationClose();
          }}
        />
      </Flex>

      <MarkdownEditor
        value={questDescription ?? ''}
        onChange={setQuestDescription}
      />
    </Flex>
  );
};
