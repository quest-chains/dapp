import { Button, Flex, Image, Input, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import Edit from '@/assets/Edit.svg';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';

export const AddQuestBlock: React.FC<{
  onClose: () => void;
  onAdd: (name: string, description: string) => void;
}> = ({ onClose, onAdd }) => {
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const onSubmit = () => {
    onAdd(name, description);
    onClose();
  };

  const isDisabled = name === '' || description === '';

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
              value={name}
              bg="#0F172A"
              id="name"
              maxLength={60}
              onChange={e => setName(e.target.value)}
              placeholder="Quest Name"
            />
          </Flex>
          <Flex w="full" flexDir="column" gap={2}>
            <Flex alignSelf="start">Description</Flex>
            <MarkdownEditor
              height="12rem"
              value={description}
              placeholder="Quest Description"
              onChange={setDescription}
            />
          </Flex>
        </VStack>
        <Flex w="100%" justify="flex-end" my={4}>
          {isDisabled && (
            <Button
              borderWidth={1}
              borderColor="white"
              height={{ base: 10, md: 12 }}
              fontSize={{ base: 9, md: 14 }}
              px={5}
              borderRadius="full"
              isDisabled
              w="full"
            >
              <Image src={Edit.src} alt="Edit" mr={3} />
              To continue, enter the name and description for the quest
            </Button>
          )}
          {!isDisabled && (
            <SubmitButton
              onClick={onSubmit}
              type="submit"
              isDisabled={isDisabled}
              w="full"
              fontWeight="bold"
              fontSize={{ base: 12, md: 14 }}
            >
              ADD QUEST
            </SubmitButton>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
