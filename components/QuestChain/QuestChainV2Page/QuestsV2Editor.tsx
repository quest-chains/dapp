import { AddIcon } from '@chakra-ui/icons';
import { Accordion, Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import { TransactionReceipt } from '@ethersproject/providers';
import { contracts, graphql } from '@quest-chains/sdk';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
  AddQuestBlock,
  defaultQuestAdvSetting,
} from '@/components/CreateChain/AddQuestBlock';
import { EditingQuest } from '@/components/CreateChain/EditingQuest';
import {
  QuestAdvSetting,
  QuestDraft,
} from '@/components/CreateChain/QuestsForm';
import { QuestTile } from '@/components/QuestTile';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { uploadMetadata } from '@/utils/metadata';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

export const QuestsV2Editor: React.FC<{
  onExit: () => void;
  refresh: () => void;
  questChain: graphql.QuestChainInfoFragment;
}> = ({ onExit, questChain, refresh }) => {
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isEditingQuest, setIsEditingQuest] = useState(false);
  const [editingQuestIndex, setEditingQuestIndex] = useState(0);

  const [questNameRef, setQuestName] = useInputText();
  const [questDescRef, setQuestDesc] = useInputText();
  const [draggingQuest, setDraggingQuest] = useState(-1);

  const [quests, setQuests] = useState<
    {
      name: string;
      description: string;
      optional: boolean;
      paused: boolean;
      skipReview: boolean;
    }[]
  >(
    questChain.quests.map(q => ({
      ...q,
      name: q.name ?? '',
      description: q.description ?? '',
    })),
  );

  const existingLength = questChain.quests.length;

  const onAddQuest = async (
    name: string,
    description: string,
    questAdvSetting: QuestAdvSetting | null,
  ) => {
    setQuests([
      ...quests,
      {
        name,
        description,
        ...(!!questAdvSetting ? questAdvSetting : defaultQuestAdvSetting),
      },
    ]);
    return true;
  };

  const onRemoveQuest = (index: number) => {
    setQuests(quests.filter((_, i) => i !== index));
  };

  const onEditQuest = (
    index: number,
    name: string,
    description: string,
    questAdvSetting: QuestAdvSetting | null = null,
  ) => {
    setIsEditingQuest(false);
    setQuests(
      quests.map((q, i) =>
        i === index
          ? { ...(questAdvSetting ? questAdvSetting : q), name, description }
          : q,
      ),
    );
  };

  const [isSaving, setSaving] = useState(false);

  const { chainId, provider } = useWallet();

  const onEdit = useCallback(
    async (
      contract: contracts.V2.QuestChain,
    ): Promise<[string, TransactionReceipt]> => {
      let tid = toast.loading('Updating Quests, please wait...');
      const newQuests: {
        questId: number;
        details: { name: string; description: string };
      }[] = [];

      for (let i = 0; i < quests.length; ++i) {
        const newQuest = quests[i];
        const oldQuest = questChain.quests[i];
        if (
          oldQuest &&
          (newQuest.name !== oldQuest?.name ||
            newQuest.description !== oldQuest?.description)
        ) {
          newQuests.push({
            questId: i,
            details: { description: newQuest.description, name: newQuest.name },
          });
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
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, questChain.chainId);
      const receipt = await tx.wait(1);

      return [tid, receipt];
    },
    [questChain, quests],
  );

  const onAdd = useCallback(
    async (
      contract: contracts.V2.QuestChain,
    ): Promise<[string, TransactionReceipt]> => {
      let tid = toast.loading('Adding Quests, please wait...');
      const newQuests: {
        questId: number;
        details: { name: string; description: string };
      }[] = [];

      for (let i = questChain.quests.length; i < quests.length; ++i) {
        const newQuest = quests[i];
        newQuests.push({
          questId: i,
          details: { name: newQuest.name, description: newQuest.description },
        });
      }

      const newQuestDetails = await Promise.all(
        newQuests.map(({ details }) => uploadMetadata(details)),
      );
      toast.dismiss(tid);
      tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      const tx = await contract.createQuests(newQuestDetails);
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, questChain.chainId);
      const receipt = await tx.wait(1);

      return [tid, receipt];
    },
    [questChain, quests],
  );

  const onConfigure = useCallback(
    async (
      contract: contracts.V2.QuestChain,
    ): Promise<[string, TransactionReceipt]> => {
      let tid = toast.loading('Configuring Quests, please wait...');
      const newQuests: {
        questId: number;
        details: { optional: boolean; paused: boolean; skipReview: boolean };
      }[] = [];

      for (let i = 0; i < quests.length; ++i) {
        const newQuest = quests[i];
        const oldQuest = questChain.quests[i];
        if (
          newQuest.optional !== oldQuest?.optional ||
          newQuest.paused !== oldQuest?.paused ||
          newQuest.skipReview !== oldQuest?.skipReview
        ) {
          newQuests.push({ questId: i, details: newQuest });
        }
      }

      toast.dismiss(tid);
      tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      const tx = await contract.configureQuests(
        newQuests.map(q => q.questId),
        newQuests.map(q => q.details),
      );
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, questChain.chainId);
      const receipt = await tx.wait(1);

      return [tid, receipt];
    },
    [questChain, quests],
  );

  const { hasEdited, hasAdvanceSettingsChanged } = useMemo(() => {
    let edited = false;
    let configured = false;
    for (let i = 0; i < quests.length; ++i) {
      const newQuest = quests[i];
      const oldQuest = questChain.quests[i];
      if (
        oldQuest &&
        (newQuest.name !== oldQuest.name ||
          newQuest.description !== oldQuest.description)
      ) {
        edited = true;
      }
      if (
        oldQuest
          ? newQuest.optional !== oldQuest.optional ||
            newQuest.paused !== oldQuest.paused ||
            newQuest.skipReview !== oldQuest.skipReview
          : newQuest.optional || newQuest.paused || newQuest.skipReview
      ) {
        configured = true;
      }
    }

    return { hasEdited: edited, hasAdvanceSettingsChanged: configured };
  }, [quests, questChain]);

  const hasAdded = useMemo(
    () => questChain.quests.length !== quests.length,
    [quests, questChain],
  );

  const hasChanged = useMemo(
    () => hasAdded || hasEdited || hasAdvanceSettingsChanged,
    [hasEdited, hasAdded, hasAdvanceSettingsChanged],
  );

  const numTransactions = useMemo(() => {
    let tx = 0;
    if (hasEdited) tx++;
    if (hasAdded) tx++;
    if (hasAdvanceSettingsChanged) tx++;
    return tx;
  }, [hasEdited, hasAdvanceSettingsChanged, hasAdded]);

  const onSave = useCallback(async () => {
    if (!chainId || !provider || questChain.chainId !== chainId) {
      toast.error(
        `Wrong Chain, please switch to ${
          AVAILABLE_NETWORK_INFO[questChain?.chainId].label
        }`,
      );
      return;
    }

    if (!hasChanged) return;
    setSaving(true);

    let tid = '';
    try {
      let receipt: TransactionReceipt | undefined;
      const contract = getQuestChainContract(
        questChain.address,
        questChain.version,
        provider.getSigner(),
      ) as contracts.V2.QuestChain;
      if (hasEdited) {
        [tid, receipt] = await onEdit(contract);
      }
      if (hasAdded) {
        if (tid) toast.dismiss(tid);
        [tid, receipt] = await onAdd(contract);
      }
      if (hasAdvanceSettingsChanged) {
        if (tid) toast.dismiss(tid);
        [tid, receipt] = await onConfigure(contract);
      }
      if (tid) toast.dismiss(tid);

      // Send second tx to set questDetails
      if (receipt) {
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
        toast.dismiss(tid);
      }

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
    hasChanged,
    hasAdvanceSettingsChanged,
    onConfigure,
    hasEdited,
    onEdit,
    hasAdded,
    onAdd,
    chainId,
    provider,
    questChain,
    onExit,
    refresh,
  ]);

  const onDropQuest = useCallback(
    (dropIndex: number) => {
      if (draggingQuest === -1) return;
      setDraggingQuest(-1);
      if (draggingQuest === dropIndex) return;
      if (dropIndex < questChain.quests.length) return;
      setQuests(oldQuests => {
        const newQuests: QuestDraft[] = [];
        oldQuests.forEach((quest, index) => {
          if (index === dropIndex && draggingQuest > dropIndex) {
            newQuests.push({
              ...oldQuests[draggingQuest],
            });
          }
          if (index !== draggingQuest) {
            newQuests.push({
              ...quest,
            });
          }
          if (index === dropIndex && draggingQuest < dropIndex) {
            newQuests.push({
              ...oldQuests[draggingQuest],
            });
          }
        });
        return newQuests;
      });
    },
    [draggingQuest, questChain],
  );

  return (
    <>
      <Flex
        w="full"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Accordion allowMultiple w="full" defaultIndex={[]}>
          {quests &&
            quests.map((q, index) => {
              const { name, description } = q;
              return isEditingQuest && editingQuestIndex === index ? (
                <EditingQuest
                  key={name + description}
                  nameRef={questNameRef}
                  descRef={questDescRef}
                  setQuestName={setQuestName}
                  setQuestDesc={setQuestDesc}
                  onSave={onEditQuest}
                  onCancel={() => setIsEditingQuest(false)}
                  index={index}
                  advSettings={q}
                />
              ) : (
                <Flex
                  w="100%"
                  key={index + name + description}
                  {...(index >= questChain.quests.length
                    ? {
                        onDragStart: () => setDraggingQuest(index),
                        onDragOver: e => e.preventDefault(),
                        onDrop: () => onDropQuest(index),
                        draggable: !isEditingQuest,
                      }
                    : {})}
                >
                  <QuestTile
                    name={`${Number(index + 1)
                      .toString()
                      .padStart(2, '0')}. ${name}`}
                    description={description}
                    questId={
                      index < existingLength ? index.toString() : undefined
                    }
                    onRemoveQuest={
                      index < existingLength || isSaving
                        ? undefined
                        : () => onRemoveQuest(index)
                    }
                    onEditQuest={() => {
                      setQuestName(name);
                      setQuestDesc(description);
                      setIsEditingQuest(true);
                      setEditingQuestIndex(index);
                    }}
                    editDisabled={isSaving || isAddingQuest}
                    advSettings={q}
                    isMember
                    questChain={questChain}
                  />
                </Flex>
              );
            })}
        </Accordion>
        {isAddingQuest && (
          <Flex w="100%" mt={3}>
            <AddQuestBlock
              onClose={() => setIsAddingQuest(false)}
              onAdd={onAddQuest}
              questVersion={questChain.version}
            />
          </Flex>
        )}
        {!isAddingQuest && !isEditingQuest && !isSaving && (
          <>
            <Button
              w="100%"
              isDisabled={isEditingQuest}
              onClick={() => setIsAddingQuest(true)}
              py={7}
              borderRadius={8}
              color="white"
              textTransform="uppercase"
              mb={3}
            >
              <HStack spacing={2} align="center">
                <AddIcon fontSize="sm" />
                <Text>Add a quest</Text>
              </HStack>
            </Button>
          </>
        )}
      </Flex>

      {!isAddingQuest && !isEditingQuest && (
        <Box w="full">
          <Flex align="center" justify="space-between" gap={4} w="full">
            {hasChanged ? (
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
            ) : null}
            <SubmitButton
              onClick={onExit}
              flex={1}
              isDisabled={isSaving}
              fontSize="sm"
              bg="transparent"
              height={10}
              border="1px solid #9EFCE5"
              color="green.200"
              _hover={{
                bg: 'whiteAlpha.200',
              }}
              px={6}
            >
              Cancel
            </SubmitButton>
          </Flex>
          {numTransactions > 1 ? (
            <Flex
              fontSize="xs"
              color="whiteAlpha.600"
              w="full"
              justifyContent={'center'}
              alignContent={'center'}
              mt={'0.5rem'}
            >
              This action will trigger {numTransactions} transactions.
            </Flex>
          ) : null}
        </Box>
      )}
    </>
  );
};
