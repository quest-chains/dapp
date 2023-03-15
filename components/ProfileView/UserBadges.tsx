import {
  Button,
  Flex,
  Grid,
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
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { TwitterShareButton } from 'react-share';

import { MastodonShareButton } from '@/components/MastodonShareButton';
import { NetworkDisplay } from '@/components/NetworkDisplay';
import { TokenImageOrVideo } from '@/components/TokenImage/TokenImageOrVideo';
import { useUserBadgesForAllChains } from '@/hooks/useUserBadgesForAllChains';
import { getQuestChainURL } from '@/utils/uriHelpers';
import { formatAddress } from '@/web3';

import { TwitterIcon } from '../icons/TwitterIcon';
import { NFTDetail } from '../QuestChain/NFTDetail';

type QuestChainBadgeInfo = {
  chainId: string;
  name?: string | null | undefined;
  description?: string | null | undefined;
  imageUrl?: string | null | undefined;
  address: string;
  slug: string | null | undefined;
  tokenAddress: string | null | undefined;
  tokenId: string | null | undefined;
};

export const UserBadges: React.FC<{
  address: string;
}> = ({ address }) => {
  const { fetching, results: userBadges } = useUserBadgesForAllChains(address);
  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();
  const copyToClipboard = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  }, []);

  const badges: QuestChainBadgeInfo[] = useMemo(
    () =>
      userBadges?.reduce((t, a) => {
        const badges =
          a?.tokens.map(b => ({
            ...b,
            chainId: a.chainId,
            address: b.questChain?.address ?? '',
            slug: b.questChain?.slug,
          })) ?? [];
        t.push(...badges);
        return t;
      }, new Array<QuestChainBadgeInfo>()) ?? [],
    [userBadges],
  );

  const [selectedNFT, setSelectedNFT] = useState<QuestChainBadgeInfo | null>(
    null,
  );

  const QCURL = selectedNFT ? getQuestChainURL(selectedNFT) : '';
  const QCmessage =
    'Level up your Web3 skills by completing a quest chain and earning a soulbound NFT! #QuestChains #NFTs #Web3';

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
          {badges?.slice(0, 4).map(b => (
            <VStack
              key={b.tokenId}
              gap={3}
              alignItems="center"
              onClick={() => setSelectedNFT(b)}
              cursor="pointer"
            >
              <TokenImageOrVideo
                uri={b.imageUrl ?? ''}
                w="16rem"
                height="16rem"
              />
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
              {badges.map(b => (
                <VStack
                  key={b.tokenId}
                  gap={3}
                  alignItems="center"
                  onClick={() => setSelectedNFT(b)}
                  cursor="pointer"
                >
                  <TokenImageOrVideo
                    uri={b.imageUrl ?? ''}
                    w="16rem"
                    height="16rem"
                  />
                </VStack>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={!!selectedNFT} onClose={() => setSelectedNFT(null)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedNFT?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack mb={3}>
              <Flex w="full" gap={4} mb={2} justifyContent="space-between">
                <NetworkDisplay chainId={selectedNFT?.chainId ?? ''} asTag />
                <Flex gap={3}>
                  <TwitterShareButton
                    url={QCURL}
                    title={QCmessage}
                    via="questchainz"
                  >
                    <Button
                      bgColor="#4A99E9"
                      p={4}
                      h={7}
                      leftIcon={<TwitterIcon />}
                    >
                      Tweet
                    </Button>
                  </TwitterShareButton>
                  <MastodonShareButton message={QCmessage + ' ' + QCURL} />
                </Flex>
              </Flex>
              <TokenImageOrVideo
                uri={selectedNFT?.imageUrl ?? ''}
                w="25rem"
                height="25rem"
              />
              <Grid
                templateColumns="1fr 4fr"
                gap={2}
                w="100%"
                alignItems="center"
                pt={2}
              >
                <NFTDetail
                  label="Address"
                  value={formatAddress(selectedNFT?.tokenAddress ?? '')}
                  tooltip={selectedNFT?.tokenAddress ?? ''}
                  onCopy={() =>
                    copyToClipboard(selectedNFT?.tokenAddress ?? '')
                  }
                />
                <NFTDetail
                  label="ID"
                  value={selectedNFT?.tokenId ?? ''}
                  onCopy={() => copyToClipboard(selectedNFT?.tokenId ?? '')}
                />
              </Grid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
