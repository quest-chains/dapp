import {
  Flex,
  Grid,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { formatAddress } from '@/web3';

import { NFTDetail } from './NFTDetail';

export const NFTDetailsModal: React.FC<{
  questChain: graphql.QuestChainInfoFragment;
  isOpen: boolean;
  onClose: () => void;
}> = ({ questChain, isOpen, onClose }) => {
  const copyToClipboard = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied to clipboard');
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{questChain.token?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex mb={3} alignItems="start" direction="column">
            <Flex w="full" gap={4} mb={2} justifyContent="space-between">
              <NetworkDisplay chainId={questChain.chainId} asTag />
            </Flex>
            <Image
              src={ipfsUriToHttp(questChain.token.imageUrl)}
              alt="quest chain NFT badge"
              maxW="100%"
              maxH="100%"
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
                value={formatAddress(questChain.token.tokenAddress)}
                tooltip={questChain.token.tokenAddress}
                onCopy={() => copyToClipboard(questChain.token.tokenAddress)}
              />
              <NFTDetail
                label="ID"
                value={questChain.token.tokenId}
                onCopy={() => copyToClipboard(questChain.token.tokenId)}
              />
            </Grid>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
