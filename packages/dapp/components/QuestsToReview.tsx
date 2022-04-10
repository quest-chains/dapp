import {
  Box,
  HStack,
  Link as ChakraLink,
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

  if (chainsToReview.length === 0) return null;

  return (
    <VStack spacing={4} align="stretch">
      <Text mb={2} mx={8} color="main" fontSize={20}>
        SUBMISSIONS TO REVIEW
      </Text>
      {fetching ? (
        <Spinner color="main" mx={10} />
      ) : (
        <>
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
                >
                  <Text mb={4} fontSize="lg" fontWeight="bold">
                    {chain.name}
                  </Text>
                  <HStack>
                    <Box>Pending: {chain.questsInReview.length}</Box>
                    <Box>Accepted: {chain.questsPassed.length}</Box>
                    <Box>Rejected: {chain.questsFailed.length}</Box>
                  </HStack>
                </VStack>
              </ChakraLink>
            </NextLink>
          ))}
        </>
      )}
    </VStack>
  );
};
