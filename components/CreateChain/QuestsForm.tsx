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
import { useState } from 'react';

import { useInputText } from '@/hooks/useInputText';

import { QuestTile } from '../QuestTile';
import { SubmitButton } from '../SubmitButton';
import { AddQuestBlock, defaultQuestAdvSetting } from './AddQuestBlock';
import { EditingQuest } from './EditingQuest';

export interface AdvanceSettingQuests {
  questIds: number[];
  questSettings: QuestAdvSetting[];
}

export interface QuestAdvSetting {
  paused: boolean;
  optional: boolean;
  skipReview: boolean;
}

export const QuestsForm: React.FC<{
  onPublishQuestChain: (
    quests: {
      name: string;
      description: string;
    }[],
    startAsDisabled: boolean,
    advanceSettingQuests: AdvanceSettingQuests | undefined,
  ) => void | Promise<void>;
  isSubmitting: boolean;
}> = ({ onPublishQuestChain, isSubmitting }) => {
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [isEditingQuest, setIsEditingQuest] = useState(false);
  const [editingQuestIndex, setEditingQuestIndex] = useState(0);

  const [questNameRef, setQuestName] = useInputText();
  const [questDescRef, setQuestDesc] = useInputText();

  const [startAsDisabled, setStartAsDisabled] = useState(false);

  const [quests, setQuests] = useState<
    {
      name: string;
      description: string;
    }[]
  >([]);
  const [advanceSettingQuests, setAdvanceSettingQuests] =
    useState<AdvanceSettingQuests>();

  const onAddQuest = async (
    name: string,
    description: string,
    questAdvSetting: QuestAdvSetting | null,
  ) => {
    if (questAdvSetting !== null) {
      setAdvanceSettingQuests(prevState => {
        // For questIds pushing quests.length because the index of new quest will be equal to quests.length.
        if (prevState)
          return {
            questIds: [...prevState?.questIds, quests.length],
            questSettings: [...prevState?.questSettings, questAdvSetting],
          };
        else
          return {
            questIds: [quests.length],
            questSettings: [questAdvSetting],
          };
      });
    }
    setQuests([...quests, { name, description }]);
    return true;
  };

  const onRemoveQuest = (index: number) => {
    setQuests(quests.filter((_, i) => i !== index));
    setAdvanceSettingQuests(prevState => {
      const indexFound = prevState?.questIds.indexOf(index);
      const questIds =
        prevState?.questIds.filter((questId, i) => i !== indexFound) || [];
      const questSettings =
        prevState?.questSettings.filter(
          (questSetting, i) => i !== indexFound,
        ) || [];

      if (questIds?.length === 0 || questSettings?.length === 0) {
        return undefined;
      }
      return {
        questIds,
        questSettings,
      };
    });
  };

  const onEditQuest = (
    name: string,
    description: string,
    questAdvSetting: QuestAdvSetting | null,
    index: number,
  ) => {
    setIsEditingQuest(false);
    if (questAdvSetting) {
      setAdvanceSettingQuests(prevState => {
        if (prevState) {
          const indexFound = prevState?.questIds.indexOf(index);
          // If index already present in questAdvSetting
          if (indexFound !== -1) {
            prevState.questSettings[indexFound] = questAdvSetting;
            return {
              questIds: [...prevState.questIds],
              questSettings: [...prevState.questSettings],
            };
          }

          // If index not present in questAdvSetting
          return {
            questIds: [...prevState.questIds, index],
            questSettings: [...prevState.questSettings, questAdvSetting],
          };
        } else
          return {
            questIds: [index],
            questSettings: [questAdvSetting],
          };
      });
    } else {
      const indexFound = advanceSettingQuests?.questIds.indexOf(index);
      // if index is present in advanceSettingQuests then delete it from questIds and advSetting
      if (indexFound !== -1) {
        setAdvanceSettingQuests(prevState => {
          const questIds =
            prevState?.questIds.filter((questId, i) => i !== indexFound) || [];
          const questSettings =
            prevState?.questSettings.filter(
              (questSetting, i) => i !== indexFound,
            ) || [];

          if (questIds?.length === 0 || questSettings?.length === 0) {
            return undefined;
          }
          return {
            questIds,
            questSettings,
          };
        });
      }
    }
    setQuests(quests.map((_, i) => (i === index ? { name, description } : _)));
  };

  return (
    <>
      <VStack
        w="full"
        align="stretch"
        spacing={10}
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
                    questVersion={'2'}
                    editedQuestAdvSettings={
                      advanceSettingQuests?.questIds.indexOf(index) !== -1
                        ? advanceSettingQuests?.questSettings[
                            advanceSettingQuests?.questIds.indexOf(index)
                          ]
                        : undefined
                    }
                    currentQuestAdvSettings={defaultQuestAdvSetting}
                  />
                ) : (
                  <QuestTile
                    key={name + description}
                    name={`${index + 1}. ${name}`}
                    description={description}
                    onRemoveQuest={() => onRemoveQuest(index)}
                    onEditQuest={() => {
                      setQuestName(name);
                      setQuestDesc(description);
                      setIsEditingQuest(true);
                      setEditingQuestIndex(index);
                    }}
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
            <Text borderBottom="dotted 1px">Start quest chain as disabled</Text>
          </Checkbox>
        </Tooltip>
      </Flex>

      <Box w="full">
        <Flex w="full" gap={4}>
          <SubmitButton
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            onClick={() =>
              onPublishQuestChain(quests, startAsDisabled, advanceSettingQuests)
            }
            flex={1}
            fontSize={{ base: 12, md: 16 }}
          >
            PUBLISH QUEST CHAIN
          </SubmitButton>
        </Flex>
        {advanceSettingQuests ? (
          <Flex
            fontSize="xs"
            color="whiteAlpha.600"
            w="full"
            justifyContent={'center'}
            alignContent={'center'}
            mt={'0.5rem'}
          >
            This action will trigger 2 transactions.
          </Flex>
        ) : null}
      </Box>
    </>
  );
};
