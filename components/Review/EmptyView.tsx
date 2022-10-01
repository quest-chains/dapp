import { Text, VStack } from '@chakra-ui/react';

export const EmptyView: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <VStack
      w="100%"
      mt={16}
      p={8}
      borderRadius={8}
      color="white"
      textAlign="center"
      spacing={4}
    >
      <Text fontSize={22}>{text}</Text>
    </VStack>
  );
};
