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
import { AddQuestBlock } from './AddQuestBlock';
import { EditingQuest } from './EditingQuest';

export const QuestsForm: React.FC<{
  onPublishQuestChain: (
    quests: { name: string; description: string }[],
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

  const [quests, setQuests] = useState<{ name: string; description: string }[]>(
    [],
  );

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
    </>
  );
};
