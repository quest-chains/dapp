import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Input, useDisclosure } from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useInputText } from '@/hooks/useInputText';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadata } from '@/utils/metadata';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { ConfirmationModal } from './ConfirmationModal';
import { MarkdownEditor } from './MarkdownEditor';

type QuestEditorProps = {
  refresh: () => void;
  questChain: graphql.QuestChainInfoFragment;
  quest: graphql.QuestInfoFragment;
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
  const [isSubmittingQuest, setSubmittingQuest] = useState(false);
  const { chainId, provider } = useWallet();

  const [questNameRef, setQuestName] = useInputText(quest.name);
  const [questDescRef, setQuestDescription] = useInputText(quest.description);

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
      if (!chainId || !provider) {
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

        const tx = await (Number(questChain.version) > 0
          ? (contract as contracts.V1.QuestChain).editQuests(
              [questId],
              [details],
            )
          : (contract as contracts.V0.QuestChain).editQuest(questId, details));
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
          maxLength={60}
          defaultValue={questNameRef.current ?? ''}
          onChange={e => setQuestName(e.target.value)}
          bg="#0F172A"
        />
        <IconButton
          borderRadius="full"
          onClick={() => {
            if (!chainId || chainId !== questChain.chainId || !provider) {
              toast.error(
                `Wrong Chain, please switch to ${
                  AVAILABLE_NETWORK_INFO[questChain.chainId].label
                }`,
              );
              return;
            }
            if (!questNameRef.current) {
              toast.error('Name cannot be empty');
              return;
            }
            if (!questDescRef.current) {
              toast.error('Description cannot be empty');
              return;
            }
            if (
              questNameRef.current === quest.name &&
              questDescRef.current === quest.description
            ) {
              toast.error('No change in name or description');
              return;
            }
            onUpdateQuestConfirmationOpen();
          }}
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
              name: questNameRef.current ?? '',
              description: questDescRef.current ?? '',
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
        value={questDescRef.current ?? ''}
        onChange={setQuestDescription}
      />
    </Flex>
  );
};
