import {
  Box,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  Progress,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { useUserProgressForAllChains } from '@/hooks/useUserProgressForAllChains';

import { NetworkDisplay } from './NetworkDisplay';

export const UserProgress: React.FC<{
  address: string;
}> = ({ address }) => {
  const { fetching, results: userStatuses } =
    useUserProgressForAllChains(address);

  return (
    <VStack spacing={4} align="stretch">
      <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
        My Progress
      </Heading>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {userStatuses.length === 0 && (
            <Text color="white">No progress found</Text>
          )}
          {userStatuses.map(us => (
            <NextLink
              as={`/chain/${us.chain.chainId}/${us.chain.address}`}
              href={`/chain/[chainId]/[address]`}
              passHref
              key={us.chain.address}
            >
              <ChakraLink display="block" _hover={{}}>
                <Flex maxW="30rem" flexDirection="column" alignItems="center">
                  <VStack
                    w="full"
                    boxShadow="inset 0px 0px 0px 1px white"
                    p={8}
                    background="#171F2B"
                    _hover={{
                      background: 'whiteAlpha.100',
                    }}
                    align="stretch"
                    spacing={4}
                    justify="space-between"
                  >
                    <HStack justify="space-between" w="100%">
                      <Heading fontSize="xl" fontWeight="bold">
                        {us.chain.name}
                      </Heading>
                    </HStack>
                    <Flex justifyContent="space-between" alignItems="center">
                      <Progress
                        value={(us.completed / us.total) * 100 || 1}
                        size="xs"
                        w="85%"
                      />
                      <Text>{(us.completed / us.total) * 100} %</Text>
                    </Flex>
                    <Text>{us.chain.description}</Text>

                    <Flex justifyContent="space-between">
                      <Text># quests: {us.total}</Text>
                      <NetworkDisplay asTag chainId={us.chain.chainId} />
                    </Flex>
                  </VStack>
                  <Box
                    boxShadow="inset 0px 0px 0px 1px white"
                    w="95%"
                    h="0.5rem"
                  ></Box>
                  <Box
                    boxShadow="inset 0px 0px 0px 1px white"
                    w="90%"
                    h="0.5rem"
                  ></Box>
                </Flex>
              </ChakraLink>
            </NextLink>
          ))}
        </>
      )}
    </VStack>
  );
};
