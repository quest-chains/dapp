import {
  Button,
  Flex,
  Grid,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { NetworkDisplay } from '@/components/NetworkDisplay';
import { ipfsUriToHttp } from '@/utils/uriHelpers';
import { formatAddress } from '@/web3';

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

const NFTDetail: React.FC<{
  label: string;
  value: string;
  tooltip?: string;
  onCopy: () => void;
}> = ({ label, value, tooltip, onCopy }) => (
  <>
    <Text fontWeight="bold" textAlign="right" fontSize="lg">
      {label}
    </Text>
    <Flex
      align="center"
      justify="space-between"
      bg="blackAlpha.400"
      p={2}
      borderRadius={6}
    >
      {tooltip ? (
        <Tooltip label={tooltip} minW="370px" p={3}>
          <Text fontWeight="bold" ml={2}>
            {value}
          </Text>
        </Tooltip>
      ) : (
        <Text fontWeight="bold" ml={2}>
          {value}
        </Text>
      )}
      <Button
        bgColor="green.400"
        color="black"
        borderRadius="6"
        px="1.25rem"
        size="sm"
        _hover={{ bgColor: 'green.700' }}
        onClick={onCopy}
      >
        Copy
      </Button>
    </Flex>
  </>
);
