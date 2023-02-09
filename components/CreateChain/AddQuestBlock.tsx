import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';

import QuestAdvancedSettings from '../QuestAdvancedSettings';
import { QuestAdvSetting } from './QuestsForm';

export const defaultQuestAdvSetting: QuestAdvSetting = {
  paused: false,
  optional: false,
  skipReview: false,
};

export const AddQuestBlock: React.FC<{
  onClose: () => void;
  onAdd: (
    name: string,
    desc: string,
    questAdvSetting: QuestAdvSetting | null,
  ) => Promise<boolean>;
  isAdding?: boolean;
  questVersion?: string;
}> = ({ onClose, onAdd, isAdding = false, questVersion = '2' }) => {
  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();

  const [questAdvSetting, setQuestAdvSetting] = useState(
    defaultQuestAdvSetting,
  );

  const onSubmit = useCallback(async () => {
    const success = await onAdd(
      nameRef.current,
      descRef.current,
      questAdvSetting,
    );
    if (success) {
      setName('');
      setDescription('');
      setQuestAdvSetting(defaultQuestAdvSetting);
      onClose();
    }
  }, [
    onAdd,
    onClose,
    nameRef,
    descRef,
    questAdvSetting,
    setName,
    setDescription,
    setQuestAdvSetting,
  ]);

  const [nameLength, setNameLength] = useState(nameRef.current.length);

  return (
    <form style={{ width: '100%' }}>
      <VStack spacing={4} pb={4} w="100%">
        <FormControl isRequired>
          <Flex align="center" justify="space-between" w="100%">
            <FormLabel fontSize="sm">Quest Name</FormLabel>
            <Text fontSize="0.8125rem">{nameLength} / 120</Text>
          </Flex>
          <Input
            color="white"
            defaultValue={nameRef.current}
            bg="#0F172A"
            id="name"
            maxLength={120}
            onChange={e => {
              setName(e.target.value);
              setNameLength(e.target.value.length);
            }}
            placeholder="Quest Name"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Quest Description</FormLabel>
          <MarkdownEditor
            height="12rem"
            value={descRef.current}
            placeholder="Quest Description"
            onChange={setDescription}
          />
        </FormControl>

        {/* Do not show advance quest settings for quest version < 2 */}
        {Number(questVersion) >= 2 ? (
          <FormControl>
            <QuestAdvancedSettings
              questAdvSetting={questAdvSetting}
              setQuestAdvSetting={setQuestAdvSetting}
              isCreatingQuest={true}
            />
          </FormControl>
        ) : null}

        <Flex
          align="center"
          justify="space-between"
          gap={4}
          w="full"
          pt={2}
          px={4}
        >
          <SubmitButton
            onClick={() => {
              if (!nameRef.current || !descRef.current) {
                toast.error(
                  'To continue, enter the name and description for the quest',
                );
                return;
              }
              onSubmit();
            }}
            fontSize="sm"
            isLoading={isAdding}
            height={10}
            flex={1}
          >
            Add quest
          </SubmitButton>
          <SubmitButton
            onClick={onClose}
            flex={1}
            isDisabled={isAdding}
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
      </VStack>
    </form>
  );
};
