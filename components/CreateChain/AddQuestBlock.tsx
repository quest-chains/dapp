import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';

export const AddQuestBlock: React.FC<{
  onClose: () => void;
  onAdd: (name: string, desc: string) => Promise<boolean>;
  isAdding?: boolean;
}> = ({ onClose, onAdd, isAdding = false }) => {
  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();

  const onSubmit = useCallback(async () => {
    const success = await onAdd(nameRef.current, descRef.current);
    if (success) {
      setName('');
      setDescription('');
      onClose();
    }
  }, [onAdd, onClose, nameRef, descRef, setName, setDescription]);

  return (
    <form>
      <VStack spacing={4} pb={4}>
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
          isLoading={isAdding}
        >
          ADD QUEST
        </SubmitButton>
      </VStack>
    </form>
  );
};
