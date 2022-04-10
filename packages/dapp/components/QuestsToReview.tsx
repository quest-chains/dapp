import {
  Link as ChakraLink,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { useQuestChainsReviewStatusQuery } from '@/graphql/types';
import { useWallet } from '@/web3';

export const QuestsToReview = () => {
  const { address } = useWallet();
  const [{ data, fetching }] = useQuestChainsReviewStatusQuery({
    variables: { reviewer: address?.toLowerCase() ?? '', first: 1000 },
  });

  const chainsToReview =
    data?.questChains.filter(c => c.questsInReview.length > 0) ?? [];

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
              as={`/review/${chain.address}`}
              href={`/review/[address]`}
              passHref
              key={chain.address}
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
                >
                  <Text mb={4} fontSize="lg" fontWeight="bold">
                    {chain.name}
                  </Text>
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
