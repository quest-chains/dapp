import { Flex, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { MutableRefObject, useEffect, useState } from 'react';

import { MarkdownEditor } from '../MarkdownEditor';
import QuestAdvancedSettings from '../QuestAdvancedSettings';
import { SubmitButton } from '../SubmitButton';
import { defaultQuestAdvSetting } from './AddQuestBlock';
import { QuestAdvSetting } from './QuestsForm';

export const EditingQuest: React.FC<{
  nameRef: MutableRefObject<string>;
  descRef: MutableRefObject<string>;
  setQuestName: (name: string) => void;
  setQuestDesc: (description: string) => void;
  onSave: (
    index: number,
    name: string,
    description: string,
    questAdvSetting?: QuestAdvSetting | null,
  ) => void;
  onCancel: () => void;
  index: number;
  advSettings?: QuestAdvSetting;
}> = ({
  nameRef,
  descRef,
  setQuestName,
  setQuestDesc,
  onSave,
  index,
  onCancel,
  advSettings,
}) => {
  const [questAdvSetting, setQuestAdvSetting] = useState(
    advSettings || defaultQuestAdvSetting,
  );

  useEffect(
    () => setQuestAdvSetting(advSettings || defaultQuestAdvSetting),
    [advSettings],
  );

  const [nameLength, setNameLength] = useState(nameRef.current.length);

  return (
    <Flex flexDir="column" bg="gray.900" borderRadius={10} gap={3} mb={3} p={4}>
      <FormControl isRequired>
        <Flex align="center" justify="space-between" w="100%">
          <FormLabel fontSize="sm">Quest Name</FormLabel>
          <Text fontSize="0.8125rem">{nameLength} / 90</Text>
        </Flex>
        <Input
          bg="#0F172A"
          defaultValue={nameRef.current}
          maxLength={90}
          flex={1}
          onChange={e => {
            setQuestName(e.target.value);
            setNameLength(e.target.value.length);
          }}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel fontSize="sm">Quest Description</FormLabel>
        <MarkdownEditor value={descRef.current ?? ''} onChange={setQuestDesc} />
      </FormControl>

      {/* Advanced Settings for QuestChain version 2*/}
      {advSettings ? (
        <QuestAdvancedSettings
          questAdvSetting={questAdvSetting}
          setQuestAdvSetting={setQuestAdvSetting}
        />
      ) : null}

      <Flex align="center" justify="space-between" gap={4} w="full">
        <SubmitButton
          onClick={() =>
            onSave(index, nameRef.current, descRef.current, questAdvSetting)
          }
          flex={1}
          fontSize="sm"
          height={10}
        >
          Save
        </SubmitButton>
        <SubmitButton
          onClick={onCancel}
          flex={1}
          fontSize="sm"
          bg="transparent"
          height={10}
          border="1px solid #9EFCE5"
          color="green.200"
          _hover={{
            bg: 'whiteAlpha.200',
          }}
        >
          Cancel
        </SubmitButton>
      </Flex>
    </Flex>
  );
};
