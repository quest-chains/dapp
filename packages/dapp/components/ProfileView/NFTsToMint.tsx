import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';

import { UserNFTStatus } from '@/hooks/useNFTsToMintForAllChains';

import { MintNFTTile } from '../MintNFTTile';

export const NFTsToMint: React.FC<{
  nftsToMint: UserNFTStatus[];
  refresh: () => void;
}> = ({ nftsToMint, refresh }) => {
  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  return (
    <VStack spacing={4} align="stretch">
      {nftsToMint.length === 0 && (
        <Text color="white">No NFTs to mint found</Text>
      )}
      {nftsToMint.length > 2 && (
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
        {nftsToMint.slice(0, 2).map(ns => (
          <MintNFTTile
            {...ns}
            key={ns.address + ns.chainId}
            onSuccess={refresh}
          />
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>All submissions to review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
              {nftsToMint.slice(0, 2).map(ns => (
                <MintNFTTile
                  {...ns}
                  key={ns.address + ns.chainId}
                  onSuccess={refresh}
                />
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
