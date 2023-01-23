import { Flex, Input } from '@chakra-ui/react';
import isEqual from 'lodash.isequal';
import { MutableRefObject, useState } from 'react';

import { MarkdownEditor } from '../MarkdownEditor';
import { SubmitButton } from '../SubmitButton';
import QuestAdvancedSettings from '../TokenImage/QuestAdvancedSettings';
import { defaultQuestAdvSetting } from './AddQuestBlock';
import { QuestAdvSetting } from './QuestsForm';

export const EditingQuest: React.FC<{
  nameRef: MutableRefObject<string>;
  descRef: MutableRefObject<string>;
  setQuestName: (name: string) => void;
  setQuestDesc: (description: string) => void;
  onSave: (
    name: string,
    description: string,
    questAdvSetting: QuestAdvSetting | null,
    index: number,
  ) => void;
  onCancel: () => void;
  index: number;
  // TODO see if makes sense to keep these optional
  questVersion?: string;
  editedQuestAdvSettings?: QuestAdvSetting;
  currentQuestAdvSettings?: QuestAdvSetting;
}> = ({
  nameRef,
  descRef,
  setQuestName,
  setQuestDesc,
  onSave,
  index,
  onCancel,
  questVersion,
  editedQuestAdvSettings,
  currentQuestAdvSettings,
}) => {
  const [questAdvSetting, setQuestAdvSetting] = useState(
    editedQuestAdvSettings || defaultQuestAdvSetting,
  );

  return (
    <Flex flexDir="column" bg="gray.900" borderRadius={10} gap={3} mb={3} p={4}>
      <Input
        bg="#0F172A"
        defaultValue={nameRef.current}
        maxLength={60}
        onChange={e => setQuestName(e.target.value)}
      />
      <MarkdownEditor value={descRef.current ?? ''} onChange={setQuestDesc} />

      {/* Advanced Settings for QuestChain version 2*/}
      {Number(questVersion) > 1 ? (
        <QuestAdvancedSettings
          questAdvSetting={questAdvSetting}
          setQuestAdvSetting={setQuestAdvSetting}
        />
      ) : null}

      <Flex align="center" justify="space-between" gap={4} w="full">
        <SubmitButton
          onClick={() =>
            onSave(
              nameRef.current,
              descRef.current,
              // Update questAdvSetting if this.questAdvSetting different from currentQuestAdvSettings
              isEqual(questAdvSetting, currentQuestAdvSettings)
                ? null
                : questAdvSetting,

              index,
            )
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
          color="#9EFCE5"
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
