import {
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalContent,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { ConnectWallet } from '@/components/ConnectWallet';
import { useWallet } from '@/web3';

import { WalletDisplay } from './WalletDisplay';

export const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { isConnected } = useWallet();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent minW="100%" h="100%" minH="100%" m={0} p={0}>
        <ModalBody h="100%">
          <VStack spacing={6} h="100%" w="100%" justify="center">
            {isConnected ? <WalletDisplay /> : <ConnectWallet />}
            <NextLink href="/explore" passHref>
              <ChakraLink display="block" _hover={{}} onClick={onClose}>
                <Text
                  borderBottomWidth={router.pathname === '/explore' ? 1 : 0}
                  borderBottomColor="main"
                  color={router.pathname === '/explore' ? 'main' : 'inherit'}
                >
                  EXPLORE
                </Text>
              </ChakraLink>
            </NextLink>
            <NextLink href="/create" passHref>
              <ChakraLink display="block" _hover={{}} onClick={onClose}>
                <Text
                  borderBottomWidth={router.pathname === '/create' ? 1 : 0}
                  borderBottomColor="main"
                  color={router.pathname === '/create' ? 'main' : 'inherit'}
                >
                  CREATE
                </Text>
              </ChakraLink>
            </NextLink>
            <NextLink href="/overview" passHref>
              <ChakraLink display="block" _hover={{}} onClick={onClose}>
                <Text
                  borderBottomWidth={router.pathname === '/overview' ? 1 : 0}
                  borderBottomColor="main"
                  color={router.pathname === '/overview' ? 'main' : 'inherit'}
                >
                  OVERVIEW
                </Text>
              </ChakraLink>
            </NextLink>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
