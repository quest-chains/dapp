import {
  HStack,
  Link as ChakraLink,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { useQuestsToReviewForAllChains } from '@/hooks/useQuestsToReviewForAllChains';

import { NetworkDisplay } from './NetworkDisplay';

export const QuestsToReview = () => {
  const { results: chainsToReview, fetching } = useQuestsToReviewForAllChains();

  return (
    <VStack spacing={4} align="stretch">
      <Text w="100%" textAlign="center" mb={2} color="main" fontSize={20}>
        SUBMISSIONS TO REVIEW
      </Text>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {chainsToReview.length === 0 && (
            <VStack w="100%">
              <Text color="white">No submissions found</Text>
            </VStack>
          )}
          {chainsToReview.map(chain => (
            <NextLink
              as={`/chain/${chain.chainId}/${chain.address}/review`}
              href={`/chain/[chainId]/[address]/review`}
              passHref
              key={chain.address}
            >
              <ChakraLink display="block" _hover={{}}>
                <VStack
                  spacing={4}
                  mb={2}
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  p={8}
                  borderRadius={20}
                  _hover={{
                    background: 'whiteAlpha.100',
                  }}
                >
                  <HStack justify="space-between" w="100%">
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color="main"
                      letterSpacing={4}
                    >
                      {chain.name}
                    </Text>
                    <NetworkDisplay asTag chainId={chain.chainId} />
                  </HStack>
                  <SimpleGrid columns={3} w="100%">
                    <VStack color="neutral">
                      <Text textAlign="center">Submitted</Text>
                    </VStack>
                    <VStack color="main">
                      <Text textAlign="center">Accepted</Text>
                    </VStack>
                    <VStack color="rejected">
                      <Text textAlign="center">Rejected</Text>
                    </VStack>
                    <VStack color="neutral">
                      <Text textAlign="center">
                        {chain.questsInReview.length +
                          chain.questsPassed.length +
                          chain.questsFailed.length}
                      </Text>
                    </VStack>
                    <VStack color="main">
                      <Text textAlign="center">
                        {chain.questsPassed.length}
                      </Text>
                    </VStack>
                    <VStack color="rejected">
                      <Text textAlign="center">
                        {chain.questsFailed.length}
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </ChakraLink>
            </NextLink>
          ))}
        </>
      )}
    </VStack>
  );
};
