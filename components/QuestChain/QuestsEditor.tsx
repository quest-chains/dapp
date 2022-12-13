import { AddIcon } from '@chakra-ui/icons';
import { Accordion, Button, Flex, Input } from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
import { providers } from 'ethers';
import { MutableRefObject, useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useInputText } from '@/hooks/useInputText';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { uploadMetadata } from '@/utils/metadata';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { AddQuestBlock } from '../CreateChain/AddQuestBlock';
import { MarkdownEditor } from '../MarkdownEditor';
import { QuestTile } from '../QuestTile';
import { SubmitButton } from '../SubmitButton';

export const QuestsEditor: React.FC<{
  onExit: () => void;
  refresh: () => void;
  questChain: graphql.QuestChainInfoFragment;
}> = ({ onExit, questChain, refresh }) => {
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isEditingQuest, setIsEditingQuest] = useState(false);
  const [editingQuestIndex, setEditingQuestIndex] = useState(0);

  const [questNameRef, setQuestName] = useInputText();
  const [questDescRef, setQuestDesc] = useInputText();

  const [quests, setQuests] = useState<{ name: string; description: string }[]>(
    questChain.quests.map(q => ({
      name: q.name ?? '',
      description: q.description ?? '',
    })),
  );

  const [paused, setPaused] = useState<{ [questId: string]: boolean }>(
    questChain.quests.reduce(
      (t, q) => ({
        ...t,
        [q.questId]: q.paused,
      }),
      {},
    ),
  );

  const existingLength = questChain.quests.length;

  const onAddQuest = async (name: string, description: string) => {
    setQuests([...quests, { name, description }]);
    return true;
  };

  const onRemoveQuest = (index: number) => {
    setQuests(quests.filter((_, i) => i !== index));
  };

  const onEditQuest = (name: string, description: string, index: number) => {
    setIsEditingQuest(false);
    setQuests(quests.map((_, i) => (i === index ? { name, description } : _)));
  };

  const [isSaving, setSaving] = useState(false);

  const { chainId, provider } = useWallet();

  const onAdd = useCallback(
    async (
      contract: contracts.V1.QuestChain,
    ): Promise<[string, providers.TransactionResponse]> => {
      let tid = toast.loading('Uploading Quests, please wait...');
      const newQuests: {
        questId: number;
        details: { name: string; description: string };
      }[] = [];

      for (let i = questChain.quests.length; i < quests.length; ++i) {
        const newQuest = quests[i];
        const oldQuest = questChain.quests[i];
        if (
          newQuest.name !== oldQuest?.name ||
          newQuest.description !== oldQuest?.description
        ) {
          newQuests.push({ questId: i, details: newQuest });
        }
      }

      const newQuestDetails = await Promise.all(
        quests
          .slice(questChain.quests.length, quests.length)
          .map(details => uploadMetadata(details)),
      );
      toast.dismiss(tid);
      tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      const tx = await contract.createQuests(newQuestDetails);

      return [tid, tx];
    },
    [questChain, quests],
  );

  const onEdit = useCallback(
    async (
      contract: contracts.V1.QuestChain,
    ): Promise<[string, providers.TransactionResponse]> => {
      let tid = toast.loading('Uploading Quests, please wait...');
      const newQuests: {
        questId: number;
        details: { name: string; description: string };
      }[] = [];

      for (let i = 0; i < quests.length; ++i) {
        const newQuest = quests[i];
        const oldQuest = questChain.quests[i];
        if (
          newQuest.name !== oldQuest?.name ||
          newQuest.description !== oldQuest?.description
        ) {
          newQuests.push({ questId: i, details: newQuest });
        }
      }

      const newQuestDetails = await Promise.all(
        newQuests.map(({ questId, details }) => ({
          questId,
          detailsUri: uploadMetadata(details),
        })),
      );
      toast.dismiss(tid);
      tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      const tx = await contract.editQuests(
        newQuestDetails.map(q => q.questId),
        newQuestDetails.map(q => q.detailsUri),
      );
      return [tid, tx];
    },
    [questChain, quests],
  );

  const onPause = useCallback(
    async (
      contract: contracts.V1.QuestChain,
    ): Promise<[string, providers.TransactionResponse]> => {
      const tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      const newQuests: {
        questId: string;
        pause: boolean;
      }[] = [];

      for (let i = 0; i < questChain.quests.length; ++i) {
        const oldQuest = questChain.quests[i];
        if (oldQuest.paused !== paused[oldQuest.questId]) {
          newQuests.push({
            questId: oldQuest.questId,
            pause: paused[oldQuest.questId],
          });
        }
      }

      const tx = await contract.pauseQuests(
        newQuests.map(q => q.questId),
        newQuests.map(q => q.pause),
      );

      return [tid, tx];
    },
    [questChain, paused],
  );

  const hasEdited = useMemo(() => {
    if (questChain.quests.length !== quests.length) return false;
    for (let i = 0; i < quests.length; ++i) {
      const newQuest = quests[i];
      const oldQuest = questChain.quests[i];
      if (
        newQuest.name !== oldQuest.name ||
        newQuest.description !== oldQuest.description
      )
        return true;
    }

    return false;
  }, [quests, questChain]);

  const hasAdded = useMemo(
    () => questChain.quests.length !== quests.length,
    [quests, questChain],
  );

  const hasPaused = useMemo(() => {
    for (let i = 0; i < questChain.quests.length; ++i) {
      const oldQuest = questChain.quests[i];
      if (oldQuest.paused !== paused[oldQuest.questId]) return true;
    }
    return false;
  }, [paused, questChain]);

  const hasChanged = useMemo(
    () => hasAdded || hasEdited || hasPaused,
    [hasPaused, hasEdited, hasAdded],
  );

  const onSave = useCallback(async () => {
    if (!chainId || !provider || questChain.chainId !== chainId) {
      toast.error(
        `Wrong Chain, please switch to ${
          AVAILABLE_NETWORK_INFO[questChain?.chainId].label
        }`,
      );
      return;
    }
    setSaving(true);

    let tid = '';
    let tx: providers.TransactionResponse | null;
    try {
      const contract = getQuestChainContract(
        questChain.address,
        questChain.version,
        provider.getSigner(),
      ) as contracts.V1.QuestChain;
      if (hasPaused) {
        [tid, tx] = await onPause(contract);
      } else if (hasEdited) {
        [tid, tx] = await onEdit(contract);
      } else {
        [tid, tx] = await onAdd(contract);
      }
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, chainId);
      const receipt = await tx.wait(1);
      toast.dismiss(tid);
      tid = toast.loading(
        'Transaction confirmed. Waiting for The Graph to index the transaction data.',
      );
      await waitUntilBlock(chainId, receipt.blockNumber);
      toast.dismiss(tid);
      toast.success(`Successfully edited the quests`);
      refresh();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setSaving(false);
      onExit();
    }
  }, [
    hasPaused,
    onPause,
    hasEdited,
    onEdit,
    onAdd,
    chainId,
    provider,
    questChain,
    onExit,
    refresh,
  ]);

  return (
    <>
      <Flex
        w="full"
        gap={4}
        mb={6}
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Accordion allowMultiple w="full" defaultIndex={[]}>
          {quests &&
            quests.map(({ name, description }, index) =>
              isEditingQuest && editingQuestIndex === index ? (
                <EditingQuest
                  key={name + description}
                  nameRef={questNameRef}
                  descRef={questDescRef}
                  setQuestName={setQuestName}
                  setQuestDesc={setQuestDesc}
                  onSave={onEditQuest}
                  onCancel={() => setIsEditingQuest(false)}
                  index={index}
                />
              ) : (
                <QuestTile
                  key={name + description}
                  name={`${index + 1}. ${name}`}
                  description={description}
                  questId={
                    index < existingLength ? index.toString() : undefined
                  }
                  onRemoveQuest={
                    index < existingLength || isSaving || hasPaused
                      ? undefined
                      : () => onRemoveQuest(index)
                  }
                  onEditQuest={() => {
                    setQuestName(name);
                    setQuestDesc(description);
                    setIsEditingQuest(true);
                    setEditingQuestIndex(index);
                  }}
                  editDisabled={
                    (hasAdded && index < existingLength) ||
                    hasPaused ||
                    isSaving ||
                    isAddingQuest
                  }
                  pauseDisabled={
                    (hasAdded && index < existingLength) ||
                    isSaving ||
                    isAddingQuest ||
                    isEditingQuest
                  }
                  isPaused={paused[index.toString()] ?? false}
                  onTogglePause={(questId: string, pause: boolean) =>
                    setPaused(o => ({ ...o, [questId]: pause }))
                  }
                  isMember
                />
              ),
            )}
        </Accordion>
        {isAddingQuest && (
          <AddQuestBlock
            onClose={() => setIsAddingQuest(false)}
            onAdd={onAddQuest}
          />
        )}
        {!isAddingQuest &&
          !isEditingQuest &&
          !isSaving &&
          !hasEdited &&
          !hasPaused && (
            <>
              <Button
                borderWidth={1}
                borderColor="white"
                borderRadius="full"
                w="100%"
                isDisabled={isEditingQuest}
                onClick={() => setIsAddingQuest(true)}
              >
                <AddIcon fontSize="sm" mr={2} />
                Add a quest
              </Button>
            </>
          )}
      </Flex>

      {!isAddingQuest && !isEditingQuest && (
        <Flex align="center" justify="space-between" gap={4} w="full" pt={2}>
          {hasChanged && (
            <SubmitButton
              onClick={onSave}
              flex={1}
              isLoading={isSaving}
              height={10}
              px={6}
              fontSize="sm"
            >
              Save Quests
            </SubmitButton>
          )}
          <SubmitButton
            onClick={onExit}
            flex={1}
            isDisabled={isSaving}
            fontSize="sm"
            bg="transparent"
            height={10}
            border="1px solid #9EFCE5"
            color="#9EFCE5"
            _hover={{
              bg: 'whiteAlpha.200',
            }}
            px={6}
          >
            Cancel
          </SubmitButton>
        </Flex>
      )}
    </>
  );
};

export const EditingQuest: React.FC<{
  nameRef: MutableRefObject<string>;
  descRef: MutableRefObject<string>;
  setQuestName: (name: string) => void;
  setQuestDesc: (description: string) => void;
  onSave: (name: string, description: string, index: number) => void;
  onCancel: () => void;
  index: number;
}> = ({
  nameRef,
  descRef,
  setQuestName,
  setQuestDesc,
  onSave,
  index,
  onCancel,
}) => {
  return (
    <Flex flexDir="column" bg="gray.900" borderRadius={10} gap={3} mb={3} p={4}>
      <Input
        bg="#0F172A"
        defaultValue={nameRef.current}
        maxLength={60}
        onChange={e => setQuestName(e.target.value)}
      />
      <MarkdownEditor value={descRef.current ?? ''} onChange={setQuestDesc} />
      <Flex align="center" justify="space-between" gap={4} w="full">
        <Button
          onClick={() => onSave(nameRef.current, descRef.current, index)}
          flex={1}
        >
          Save
        </Button>
        <Button onClick={onCancel} flex={1}>
          Cancel
        </Button>
      </Flex>
    </Flex>
  );
};
