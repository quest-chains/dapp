import { Flex, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import isequal from 'lodash.isequal';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';

import QuestAdvancedSettings from '../TokenImage/QuestAdvancedSettings';
import { QuestAdvSetting } from './QuestsForm';

export const defaultQuestAdvSetting: QuestAdvSetting = {
  paused: false,
  optional: false,
  skipReview: false,
};

// TODO handle adv settings when component called from parents other than AddQuestBlock
export const AddQuestBlock: React.FC<{
  onClose: () => void;
  onAdd: (
    name: string,
    desc: string,
    questAdvSetting: QuestAdvSetting | null,
  ) => Promise<boolean>;
  isAdding?: boolean;
}> = ({ onClose, onAdd, isAdding = false }) => {
  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();

  const [questAdvSetting, setQuestAdvSetting] = useState(
    defaultQuestAdvSetting,
  );

  const onSubmit = useCallback(async () => {
    const success = await onAdd(
      nameRef.current,
      descRef.current,
      // TODO check if we update paused to default
      isequal(questAdvSetting, defaultQuestAdvSetting) ? null : questAdvSetting,
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

  return (
    <form style={{ width: '100%' }}>
      <VStack spacing={4} pb={4} w="100%">
        <FormControl isRequired px={4}>
          <FormLabel htmlFor="name">Quest Name</FormLabel>
          <Input
            color="white"
            defaultValue={nameRef.current}
            bg="#0F172A"
            id="name"
            maxLength={60}
            onChange={e => setName(e.target.value)}
            placeholder="Quest Name"
          />
        </FormControl>
        <FormControl isRequired px={4}>
          <FormLabel htmlFor="description">Quest Description</FormLabel>
          <MarkdownEditor
            height="12rem"
            value={descRef.current}
            placeholder="Quest Description"
            onChange={setDescription}
          />
        </FormControl>

        <FormControl px={4}>
          <QuestAdvancedSettings
            questAdvSetting={questAdvSetting}
            setQuestAdvSetting={setQuestAdvSetting}
          />
        </FormControl>

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
