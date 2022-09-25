import { Flex, Image, Input, VStack } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

import Edit from '@/assets/Edit.svg';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';

export const AddQuestBlock: React.FC<{
  onClose: () => void;
  onAdd: (name: string, desc: string) => void;
}> = ({ onClose, onAdd }) => {
  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();

  const onSubmit = () => {
    onAdd(nameRef.current, descRef.current);
    onClose();
  };

  return (
    <Flex
      w="full"
      gap={20}
      alignItems="normal"
      display={{ base: 'box', md: 'flex' }}
    >
      <Flex flexGrow={1} flexDirection="column">
        <VStack mb={4} spacing={4}>
          <Flex w="full" flexDir="column" gap={2}>
            <Flex alignSelf="start">Name</Flex>
            <Input
              color="white"
              defaultValue={nameRef.current}
              bg="#0F172A"
              id="nameRef.current"
              maxLength={60}
              onChange={e => setName(e.target.value)}
              placeholder="Quest Name"
            />
          </Flex>
          <Flex w="full" flexDir="column" gap={2}>
            <Flex alignSelf="start">Description</Flex>
            <MarkdownEditor
              height="12rem"
              value={descRef.current}
              placeholder="Quest Description"
              onChange={setDescription}
            />
          </Flex>
        </VStack>
        <Flex w="100%" justify="flex-end" my={4}>
          <SubmitButton
            onClick={() => {
              if (!nameRef.current || !descRef.current) {
                toast.error(
                  <>
                    <Image src={Edit.src} alt="Edit" mr={3} />
                    To continue, enter the name and description for the quest
                  </>,
                );
                return;
              }
              onSubmit();
            }}
            type="submit"
            w="full"
            fontWeight="bold"
            fontSize={{ base: 12, md: 14 }}
          >
            ADD QUEST
          </SubmitButton>
        </Flex>
      </Flex>
    </Flex>
  );
};
