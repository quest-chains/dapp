import { Flex, Input } from '@chakra-ui/react';
import { MutableRefObject } from 'react';

import { MarkdownEditor } from '../MarkdownEditor';
import { SubmitButton } from '../SubmitButton';

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
        <SubmitButton
          onClick={() => onSave(nameRef.current, descRef.current, index)}
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
