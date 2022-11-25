import {
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
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
import { TwitterShareButton } from 'react-share';

import { MastodonShareButton } from '@/components/MastodonShareButton';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { TokenImageOrVideo } from '@/components/TokenImage/TokenImageOrVideo';
import { useUserBadgesForAllChains } from '@/hooks/useUserBadgesForAllChains';
import { QUESTCHAINS_URL } from '@/utils/constants';

type QuestChainBadgeInfo = {
  chainId: string;
  name?: string | null | undefined;
  description?: string | null | undefined;
  chainAddress: string;
  imageUrl: string;
};

type NFT = {
  imageUrl: string;
  chainId: string;
  name: string | null | undefined;
  chainAddress: string;
};

export const UserBadges: React.FC<{
  address: string;
}> = ({ address }) => {
  const { fetching, results: userBadges } = useUserBadgesForAllChains(address);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  const badges: QuestChainBadgeInfo[] = useMemo(
    () =>
      userBadges?.reduce((t, a) => {
        const badges =
          a?.tokens.map(b => ({
            ...b,
            chainId: a.chainId,
            chainAddress: b.questChain?.address ?? '',
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
    chainAddress: '',
  });

  const QCURL = `${QUESTCHAINS_URL}/chain/${selectedNFT.chainId}/${selectedNFT.chainAddress}`;
  const QCmessage =
    'Have you got what it takes? Try to complete this quest chain to obtain it’s soulbound NFT!';

  return (
    <VStack spacing={4} align="stretch">
      <Flex justifyContent="space-between" alignItems="baseline">
        <Heading w="100%" textAlign="left" mb={2} fontSize={28}>
          NFT Gallery
        </Heading>
        {badges?.length > 4 && (
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
        <HStack spacing={4} align="stretch">
          {badges.length === 0 && (
            <Text color="white" ml={4}>
              No badges found
            </Text>
          )}
          {badges
            ?.slice(0, 4)
            .map(({ chainId, name, imageUrl, chainAddress }) => (
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
                    chainAddress,
                  });
                }}
                cursor="pointer"
              >
                <TokenImageOrVideo uri={imageUrl} w="16rem" height="16rem" />
              </VStack>
            ))}
        </HStack>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>NFT Gallery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(4, 1fr)">
              {badges.map(({ chainId, name, imageUrl, chainAddress }) => (
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
                      chainAddress,
                    });
                  }}
                  cursor="pointer"
                >
                  <TokenImageOrVideo uri={imageUrl} w="16rem" height="16rem" />
                </VStack>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedNFT?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack mb={3}>
              <Flex w="full" gap={4} mb={2} justifyContent="space-between">
                <NetworkDisplay chainId={selectedNFT?.chainId} asTag />
                <Flex gap={3}>
                  <TwitterShareButton
                    url={QCURL}
                    title={QCmessage}
                    via="questchainz"
                  >
                    <Button bgColor="#4A99E9" p={4} h={7}>
                      <Image
                        src="/twitter.svg"
                        alt="twitter"
                        height={4}
                        mr={1}
                      />
                      Tweet
                    </Button>
                  </TwitterShareButton>
                  <MastodonShareButton message={QCmessage + ' ' + QCURL} />
                </Flex>
              </Flex>
              <TokenImageOrVideo
                uri={selectedNFT?.imageUrl}
                w="25rem"
                height="25rem"
              />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
