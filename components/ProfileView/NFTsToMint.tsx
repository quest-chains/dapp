import {
  Button,
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

import { useNFTsToMintForAllChains } from '@/hooks/useNFTsToMintForAllChains';
import { useWallet } from '@/web3';

import { MintNFTTile } from '../MintNFTTile';

export const NFTsToMint: React.FC = () => {
  const { address } = useWallet();
  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  const {
    results: nftsToMint,
    fetching,
    refresh,
  } = useNFTsToMintForAllChains(address);

  return (
    <VStack spacing={4} align="stretch">
      {fetching ? (
        <Spinner color="main" ml={4} />
      ) : (
        <>
          {nftsToMint.length === 0 && (
            <Text color="white" ml={4}>
              No NFTs to mint
            </Text>
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
                key={ns.questChain.address + ns.questChain.chainId}
                onSuccess={refresh}
              />
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
              {nftsToMint.slice(0, 2).map(ns => (
                <MintNFTTile
                  {...ns}
                  key={ns.questChain.address + ns.questChain.chainId}
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
