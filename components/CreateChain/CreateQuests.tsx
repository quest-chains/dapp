import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';

import { SubmitButton } from '@/components/SubmitButton';

export const CreateQuests: React.FC = () => {
  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={10}
      boxShadow="inset 0px 0px 0px 1px white"
      borderRadius={10}
      px={{ base: 4, md: 12 }}
      py={8}
    >
      <HStack w="100%">
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
      <Flex w="100%" align="flex-start" gap={20} mb={14}></Flex>
      <SubmitButton type="submit" w="full">
        PUBLISH QUEST CHAIN
      </SubmitButton>
    </VStack>
  );
};
