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

import { WalletDisplay } from './WalletDisplay';

export const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent minW="100%" h="100%" minH="100%" bg="none" m={0} p={0}>
        <ModalBody h="100%">
          <VStack spacing={6} h="100%" w="100%" justify="center">
            <WalletDisplay />
            <NextLink href="/search" passHref>
              <ChakraLink display="block" _hover={{}} onClick={onClose}>
                <Text
                  borderBottomWidth={router.pathname === '/search' ? 1 : 0}
                  borderBottomColor="main"
                  color={router.pathname === '/search' ? 'main' : 'inherit'}
                >
                  SEARCH
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
