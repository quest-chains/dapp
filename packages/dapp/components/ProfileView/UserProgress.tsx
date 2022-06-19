import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import removeMd from 'remove-markdown';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { UserStatus } from '@/graphql/statusForUser';
import { useUserProgressForAllChains } from '@/hooks/useUserProgressForAllChains';
import { useWallet } from '@/web3';

import { QuestChainTile } from '../QuestChainTile';

const QuestChainWithProgress: React.FC<{ userStatus: UserStatus }> = ({
  userStatus: {
    chain: { chainId, address, name, description, imageUrl },
    completed,
    total,
  },
}) => (
  <QuestChainTile
    {...{
      address,
      name,
      description,
      chainId,
      quests: total,
      completed,
      imageUrl,
    }}
    key={address}
  />
);

export const UserProgress: React.FC<{
  address: string;
}> = ({ address }) => {
  const { address: userAddress } = useWallet();
  const isLoggedInUser = address === userAddress?.toLowerCase();

  const { fetching, results: userStatuses } =
    useUserProgressForAllChains(address);
  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  return (
    <VStack spacing={4} align="stretch">
      <Flex justifyContent="space-between" alignItems="baseline">
        <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
          {isLoggedInUser ? 'My ' : ''}Progress
        </Heading>
        {userStatuses.length > 2 && (
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
      </Flex>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {userStatuses.length === 0 && (
            <Text color="white">No progress found</Text>
          )}
          <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
            {userStatuses.slice(0, 2).map(us => (
              <QuestChainWithProgress userStatus={us} key={us.chain.address} />
            ))}
          </SimpleGrid>
        </>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>My Progress</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
              {userStatuses.map(us => (
                <QuestChainWithProgress
                  userStatus={us}
                  key={us.chain.address}
                />
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
