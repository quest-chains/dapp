import {
  Box,
  Button,
  Flex,
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

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { QuestChainReviewInfoFragment } from '@/graphql/types';
import { useQuestsToReviewForAllChains } from '@/hooks/useQuestsToReviewForAllChains';
import { useWallet } from '@/web3';

const QuestChainStatusView: React.FC<{
  questChain: QuestChainReviewInfoFragment;
}> = ({ questChain: chain }) => (
  <NextLink
    as={`/chain/${chain.chainId}/${chain.address}/review`}
    href={`/chain/[chainId]/[address]/review`}
    passHref
  >
    <ChakraLink display="block" _hover={{}} p={0}>
      <Box background="rgba(71, 31, 71, 0.3)" p={8}>
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
            <Text textAlign="center">{chain.questsPassed.length}</Text>
          </VStack>
          <VStack color="rejected">
            <Text textAlign="center">{chain.questsFailed.length}</Text>
          </VStack>
        </SimpleGrid>
        <Flex justifyContent="right">
          <NetworkDisplay asTag chainId={chain.chainId} />
        </Flex>
      </Box>
    </ChakraLink>
  </NextLink>
);

export const QuestsToReview: React.FC = () => {
  const { address } = useWallet();
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
        <Spinner color="main" ml={4} />
      ) : (
        <>
          {chainsToReview.length === 0 && (
            <Text color="white" ml={4}>
              No submissions found
            </Text>
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
          <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
            {chainsToReview.slice(0, 2).map(chain => (
              <QuestChainStatusView questChain={chain} key={chain.address} />
            ))}
          </SimpleGrid>
        </>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>All submissions to review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
              {chainsToReview.slice(0, 2).map(chain => (
                <QuestChainStatusView questChain={chain} key={chain.address} />
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
