import { Flex, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

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
    <Flex w="full" alignItems="normal" display={{ base: 'box', md: 'flex' }}>
      <form>
        <Flex flexGrow={1} flexDirection="column" gap={4} mb={4}>
          <VStack spacing={4}>
            <FormControl isRequired>
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
            <FormControl isRequired>
              <FormLabel htmlFor="description">Quest Description</FormLabel>
              <MarkdownEditor
                height="12rem"
                value={descRef.current}
                placeholder="Quest Description"
                onChange={setDescription}
              />
            </FormControl>
          </VStack>
          <Flex w="100%" justify="flex-end">
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
              w="full"
              fontWeight="bold"
              fontSize={{ base: 12, md: 14 }}
            >
              ADD QUEST
            </SubmitButton>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};
