import {
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

import { useUserBadgesForAllChains } from '@/hooks/useUserBadgesForAllChains';

import { NetworkDisplay } from './NetworkDisplay';
import { TokenImageOrVideo } from './TokenImage/TokenImageOrVideo';

type QuestChainBadgeInfo = {
  chainId: string;
  name?: string | null | undefined;
  description?: string | null | undefined;
  imageUrl: string;
};

type NFT = {
  imageUrl: string;
  chainId: string;
  name: string | null | undefined;
};

export const UserBadges: React.FC<{
  address: string;
}> = ({ address }) => {
  const { fetching, results: userBadges } = useUserBadgesForAllChains(address);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const badges: QuestChainBadgeInfo[] = useMemo(
    () =>
      userBadges?.reduce((t, a) => {
        const badges =
          a?.tokens.map(b => ({
            ...b,
            chainId: a.chainId,
            imageUrl: b.imageUrl ?? '',
          })) ?? [];
        t.push(...badges);
        return t;
      }, new Array<QuestChainBadgeInfo>()) ?? [],
    [userBadges],
  );

  const [selectedNFT, setSelectedNFT] = useState<NFT>({
    imageUrl: '',
    chainId: '',
    name: '',
  });

  return (
    <VStack spacing={4} align="stretch">
      <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
        NFT Gallery
      </Heading>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <HStack spacing={4} align="stretch">
          {badges.length === 0 && <Text color="white">No badges found.</Text>}
          {badges?.map(({ chainId, name, imageUrl }) => (
            <VStack
              key={address}
              gap={3}
              alignItems="center"
              onClick={() => {
                onOpen();
                setSelectedNFT({
                  imageUrl,
                  chainId,
                  name,
                });
              }}
              cursor="pointer"
            >
              <TokenImageOrVideo uri={imageUrl} w="16rem" height="16rem" />
            </VStack>
          ))}
        </HStack>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="36rem">
          <ModalHeader>{selectedNFT?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack>
              <TokenImageOrVideo
                uri={selectedNFT?.imageUrl}
                w="25rem"
                height="25rem"
              />
              <NetworkDisplay chainId={selectedNFT?.chainId} asTag />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
