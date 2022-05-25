import {
  HStack,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { useUserQuestsRejectedForAllChains } from '@/hooks/useUserQuestsRejectedForAllChains';

export const QuestsRejected: React.FC<{
  address: string;
}> = ({ address }) => {
  const { results: questsRejected, fetching } =
    useUserQuestsRejectedForAllChains(address);

  return (
    <VStack spacing={4} align="stretch">
      <Text w="100%" textAlign="left" mb={2} color="main" fontSize={20}>
        REJECTED QUESTS
      </Text>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {questsRejected.length === 0 && (
            <Text color="white">No rejected quests</Text>
          )}
          {questsRejected.map(quest => (
            <NextLink as={`''`} href={''} passHref key={''}>
              <ChakraLink display="block" _hover={{}}>
                quest
              </ChakraLink>
            </NextLink>
          ))}
        </>
      )}
    </VStack>
  );
};
