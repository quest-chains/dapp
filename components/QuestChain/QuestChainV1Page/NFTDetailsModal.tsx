import { CopyIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
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
            <Accordion allowMultiple w="full">
              <AccordionItem>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" fontSize={13}>
                    Additional Info
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={1}>
                  <Flex
                    justifyContent="space-between"
                    w="full"
                    alignItems="center"
                  >
                    <Flex fontSize={12}>
                      Address:{' '}
                      <Tooltip label={questChain.token.tokenAddress}>
                        <Text fontWeight="bold" ml={2}>
                          {formatAddress(questChain.token.tokenAddress)}
                        </Text>
                      </Tooltip>
                    </Flex>
                    <Button
                      variant="ghost"
                      p={0}
                      onClick={() =>
                        copyToClipboard(questChain.token.tokenAddress)
                      }
                    >
                      <CopyIcon />
                    </Button>
                  </Flex>
                  <Flex
                    justifyContent="space-between"
                    w="full"
                    alignItems="center"
                  >
                    <Flex fontSize={12}>
                      Id:
                      <Text fontWeight="bold" ml={2}>
                        {questChain.token.tokenId}
                      </Text>
                    </Flex>
                    <Button
                      variant="ghost"
                      p={0}
                      onClick={() => copyToClipboard(questChain.token.tokenId)}
                    >
                      <CopyIcon />
                    </Button>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
