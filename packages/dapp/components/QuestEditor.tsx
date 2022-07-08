import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Input, useDisclosure } from '@chakra-ui/react';
import { Signer } from 'ethers';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { QuestChain, QuestChain__factory } from '@/types';
import { ZERO_ADDRESS } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadataViaAPI } from '@/utils/metadata';
import { useWallet } from '@/web3';

import { ConfirmationModal } from './ConfirmationModal';
import { MarkdownEditor } from './MarkdownEditor';

type QuestEditorProps = {
  refresh: () => void;
  questChainAddress?: string;
  questChainId?: string;
  quest: any;
  setEditingQuest: (sth: boolean) => void;
};

export const QuestEditor: React.FC<QuestEditorProps> = ({
  refresh,
  questChainAddress,
  questChainId,
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

  const contract: QuestChain = QuestChain__factory.connect(
    questChainAddress ?? ZERO_ADDRESS,
    provider?.getSigner() as Signer,
  );
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
      if (!chainId || chainId !== questChainId) {
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
        const hash = await uploadMetadataViaAPI(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm the transaction in your Wallet',
        );
        const tx = await contract.editQuest(questId, details);
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
    [chainId, questChainId, setEditingQuest, contract, refresh],
  );

  return (
    <Flex flexDirection="column" w="full">
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
            onUpdateQuestConfirmationClose();
          }}
        />
      </Flex>

      <MarkdownEditor value={questDescription} onChange={setQuestDescription} />
    </Flex>
  );
};
