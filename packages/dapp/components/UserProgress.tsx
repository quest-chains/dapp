import {
  HStack,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { useUserProgressForAllChains } from '@/hooks/useUserProgressForAllChains';

import { NetworkDisplay } from './NetworkDisplay';

export const UserProgress = () => {
  const { fetching, results: userStatuses } = useUserProgressForAllChains();

  return (
    <VStack spacing={4} align="stretch">
      <Text w="100%" textAlign="center" mb={2} color="main" fontSize={20}>
        MY PROGRESS
      </Text>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {userStatuses.length === 0 && (
            <VStack w="100%">
              <Text color="white">No progress found</Text>
            </VStack>
          )}
          {userStatuses.map(us => (
            <NextLink
              as={`/chain/${us.chain.address}`}
              href={`/chain/[address]`}
              passHref
              key={us.chain.address}
            >
              <ChakraLink display="block" _hover={{}}>
                <VStack
                  mb={2}
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  p={8}
                  borderRadius={20}
                  _hover={{
                    background: 'whiteAlpha.100',
                  }}
                  align="stretch"
                  spacing={4}
                  justify="space-between"
                >
                  <HStack justify="space-between" w="100%">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="main"
                      letterSpacing={4}
                    >
                      {us.chain.name}
                    </Text>
                    <NetworkDisplay asTag chainId={us.chain.chainId} />
                  </HStack>
                  <Text>
                    {us.completed} / {us.total}
                  </Text>
                </VStack>
              </ChakraLink>
            </NextLink>
          ))}
        </>
      )}
    </VStack>
  );
};
