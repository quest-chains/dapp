import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { useQuestsToReviewForAllChains } from '@/hooks/useQuestsToReviewForAllChains';

import { NetworkDisplay } from './NetworkDisplay';

export const QuestsToReview: React.FC<{
  address: string;
}> = ({ address }) => {
  const { results: chainsToReview, fetching } =
    useQuestsToReviewForAllChains(address);

  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  return (
    <VStack spacing={4} align="stretch">
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {chainsToReview.length === 0 && (
            <Text color="white">No submissions found</Text>
          )}
          {chainsToReview.length > 2 && (
            <Button
              variant="ghost"
              whiteSpace="nowrap"
              fontWeight="bold"
              color="main"
              borderRadius="3xl"
              onClick={onOpenSeeAll}
            >
              SEE ALL
            </Button>
          )}
          <Grid gap={8} templateColumns="repeat(2, 1fr)">
            {chainsToReview.slice(0, 2).map(chain => (
              <NextLink
                as={`/chain/${chain.chainId}/${chain.address}/review`}
                href={`/chain/[chainId]/[address]/review`}
                passHref
                key={chain.address}
              >
                <ChakraLink display="block" _hover={{}}>
                  <Box background="rgba(71, 31, 71, 0.3)" p={8} maxW="32rem">
                    <Heading fontSize="xl" fontWeight="bold" mb={4}>
                      {chain.name}
                    </Heading>
                    <SimpleGrid columns={3} w="100%" mb={4}>
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
                    <Flex justifyContent="right">
                      <NetworkDisplay asTag chainId={chain.chainId} />
                    </Flex>
                  </Box>
                </ChakraLink>
              </NextLink>
            ))}
          </Grid>
        </>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>All submissions to review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid gap={8} templateColumns="repeat(2, 1fr)">
              {chainsToReview.slice(0, 2).map(chain => (
                <NextLink
                  as={`/chain/${chain.chainId}/${chain.address}/review`}
                  href={`/chain/[chainId]/[address]/review`}
                  passHref
                  key={chain.address}
                >
                  <ChakraLink display="block" _hover={{}}>
                    <Box background="rgba(71, 31, 71, 0.3)" p={8} maxW="32rem">
                      <Heading fontSize="xl" fontWeight="bold" mb={4}>
                        {chain.name}
                      </Heading>
                      <SimpleGrid columns={3} w="100%" mb={4}>
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
                      <Flex justifyContent="right">
                        <NetworkDisplay asTag chainId={chain.chainId} />
                      </Flex>
                    </Box>
                  </ChakraLink>
                </NextLink>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
