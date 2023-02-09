import { AddIcon } from '@chakra-ui/icons';
import {
  Accordion,
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  Image,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';

import { useInputText } from '@/hooks/useInputText';

import { QuestTile } from '../QuestTile';
import { SubmitButton } from '../SubmitButton';
import { AddQuestBlock, defaultQuestAdvSetting } from './AddQuestBlock';
import { EditingQuest } from './EditingQuest';

export interface QuestAdvSetting {
  paused: boolean;
  optional: boolean;
  skipReview: boolean;
}

type QuestDraft = {
  name: string;
  description: string;
  optional: boolean;
  skipReview: boolean;
  paused: boolean;
};

export const QuestsForm: React.FC<{
  onPublishQuestChain: (
    quests: {
      name: string;
      description: string;
      optional: boolean;
      skipReview: boolean;
      paused: boolean;
    }[],
    startAsDisabled: boolean,
  ) => void | Promise<void>;
  isSubmitting: boolean;
}> = ({ onPublishQuestChain, isSubmitting }) => {
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isEditingQuest, setIsEditingQuest] = useState(false);
  const [editingQuestIndex, setEditingQuestIndex] = useState(0);

  const [questNameRef, setQuestName] = useInputText();
  const [questDescRef, setQuestDesc] = useInputText();

  const [startAsDisabled, setStartAsDisabled] = useState(false);
  const [draggingQuest, setDraggingQuest] = useState(-1);

  const [quests, setQuests] = useState<QuestDraft[]>([]);

  const onAddQuest = async (
    name: string,
    description: string,
    questAdvSetting: QuestAdvSetting | null,
  ) => {
    setQuests([
      ...quests,
      { name, description, ...(questAdvSetting ?? defaultQuestAdvSetting) },
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

  const onlyOptionalQuests = useMemo(() => {
    if (quests.length === 0) return false;
    if (quests.find(s => !s.optional)) return false;
    return true;
  }, [quests]);

  const hasAdvancedSettings = useMemo(() => {
    if (quests.length === 0) return false;
    if (
      quests.some(
        ({ optional, skipReview, paused }) => optional || skipReview || paused,
      )
    )
      return true;
    return false;
  }, [quests]);

  const onDropQuest = useCallback(
    (dropIndex: number) => {
      if (draggingQuest === -1) return;
      setDraggingQuest(-1);
      if (draggingQuest === dropIndex) return;
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
    [draggingQuest],
  );

  return (
    <>
      <VStack
        w="full"
        minW={{ base: 0, lg: '3xl' }}
        align="stretch"
        boxShadow="inset 0px 0px 0px 1px white"
        borderRadius={10}
        px={{ base: 4, md: 12 }}
        py={8}
      >
        <HStack w="full">
          <Box
            py={1}
            px={3}
            borderWidth={1}
            borderColor="gray.500"
            color="gray.500"
            borderRadius={4}
            mr={4}
          >
            STEP 4
          </Box>
          <Text fontWeight="bold" fontSize={16}>
            Quests
          </Text>
        </HStack>
        <Flex
          w="full"
          gap={8}
          mb={14}
          justifyContent="center"
          alignItems="center"
          flexDir="column"
        >
          <Accordion allowMultiple w="full" defaultIndex={[]}>
            {quests &&
              quests.map(({ name, description, ...q }, index) =>
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
                    advSettings={q}
                  />
                ) : (
                  <Flex
                    w="100%"
                    key={index + name + description}
                    onDragStart={() => setDraggingQuest(index)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => onDropQuest(index)}
                    draggable={!isEditingQuest}
                  >
                    <QuestTile
                      name={`${index + 1}. ${name}`}
                      description={description}
                      onRemoveQuest={() => onRemoveQuest(index)}
                      onEditQuest={() => {
                        setQuestName(name);
                        setQuestDesc(description);
                        setIsEditingQuest(true);
                        setEditingQuestIndex(index);
                      }}
                      advSettings={q}
                    />
                  </Flex>
                ),
              )}
          </Accordion>
          {isAddingQuest && (
            <AddQuestBlock
              onClose={() => setIsAddingQuest(false)}
              onAdd={onAddQuest}
            />
          )}
          {!isAddingQuest && (
            <>
              {!quests.length && (
                <>
                  <Image
                    src="/CreateChain/bullseye.svg"
                    alt="circles3"
                    w={20}
                  />
                  <Text fontSize={20} fontWeight="bold">
                    Finally, let’s add some quests.
                  </Text>
                </>
              )}
              <Button
                borderWidth={1}
                borderColor="white"
                borderRadius="full"
                py={2}
                px={{ base: 10, md: 40 }}
                isDisabled={isEditingQuest}
                onClick={() => setIsAddingQuest(true)}
                textTransform="uppercase"
              >
                <AddIcon fontSize="sm" mr={2} />
                Add a quest
              </Button>
            </>
          )}
          {!quests.length && (
            <Text>
              It is perfectly fine to add quests after the quest chain has been
              published.
            </Text>
          )}
        </Flex>
      </VStack>

      <Flex w="full" justifyContent="center">
        <Tooltip
          label="A disabled quest chain won't be visible to public. You can enable it at a later time."
          shouldWrapChildren
        >
          <Checkbox
            isChecked={startAsDisabled}
            onChange={() => setStartAsDisabled(!startAsDisabled)}
          >
            <Text fontSize={10}>Start quest chain as disabled</Text>
          </Checkbox>
        </Tooltip>
      </Flex>

      {onlyOptionalQuests ? (
        <Flex
          fontSize="sm"
          color="whiteAlpha.600"
          w="full"
          justifyContent={'center'}
          alignContent={'center'}
          textAlign="center"
          direction="column"
          mt={'0.5rem'}
        >
          <Text>All the quests in this quest chain are optional.</Text>
          <Text>
            The questers must complete at least one of the quests to be eligible
            to mint the completion NFT.
          </Text>
        </Flex>
      ) : null}

      <Box w="full">
        <Flex w="full" gap={4}>
          <SubmitButton
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            onClick={() => onPublishQuestChain(quests, startAsDisabled)}
            flex={1}
            fontSize={{ base: 12, md: 16 }}
          >
            PUBLISH QUEST CHAIN
          </SubmitButton>
        </Flex>
        {hasAdvancedSettings ? (
          <Flex
            fontSize="xs"
            color="whiteAlpha.600"
            w="full"
            justifyContent={'center'}
            alignContent={'center'}
            textAlign="center"
            mt={'0.5rem'}
          >
            This action will trigger 2 transactions.
          </Flex>
        ) : null}
      </Box>
    </>
  );
};
