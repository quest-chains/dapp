import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalContent,
  Portal,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { ConnectWallet } from '@/components/Layout/ConnectWallet';
import { useWallet } from '@/web3';

import { NavToggle } from './NavToggle';
import { WalletDisplay } from './WalletDisplay';

export const MobileMenu: React.FC<{
  isOpen: boolean;
  toggleOpen: () => void;
  onSearchOpen: () => void;
}> = ({ isOpen, toggleOpen, onSearchOpen }) => {
  const { asPath } = useRouter();
  const { isConnected, address, user } = useWallet();

  return (
    <>
      <Portal>
        <NavToggle isOpen={isOpen} onClick={toggleOpen} />
      </Portal>
      <Modal isOpen={isOpen} onClose={toggleOpen}>
        <ModalContent
          minW="100%"
          h="100%"
          minH="100%"
          m={0}
          p={0}
          borderRadius={0}
        >
          <ModalBody h="100%">
            <VStack spacing={6} h="100%" w="100%" justify="center">
              {isConnected ? <WalletDisplay /> : <ConnectWallet />}
              <ChakraLink
                as={NextLink}
                href="/create"
                display="block"
                _hover={{}}
                onClick={toggleOpen}
              >
                <Button
                  borderWidth={1}
                  bg="none"
                  borderColor={asPath === '/create' ? 'main' : 'white'}
                  _hover={{
                    bgColor: 'whiteAlpha.100',
                    borderColor: 'main',
                  }}
                  transition="0.25s"
                  px={5}
                  py={2}
                  borderRadius="full"
                >
                  <Text color="white">Create a chain</Text>
                </Button>
              </ChakraLink>
              <ChakraLink
                as={NextLink}
                href="/explore"
                display="block"
                _hover={{}}
                onClick={toggleOpen}
              >
                <Text
                  color="main"
                  boxShadow={
                    asPath === '/explore' ? '0 4px 2px -2px #1f7165' : 'none'
                  }
                  _hover={{
                    boxShadow: '0 4px 2px -2px #1f7165',
                  }}
                  transition="0.25s"
                >
                  Explore
                </Text>
              </ChakraLink>
              {isConnected && (
                <ChakraLink
                  as={NextLink}
                  href={`/profile/${user?.username ?? address}`}
                  display="block"
                  boxShadow={
                    asPath === `/profile/${user?.username ?? address}`
                      ? '0 4px 2px -2px #1f7165'
                      : 'none'
                  }
                  _hover={{
                    boxShadow: '0 4px 2px -2px #1f7165',
                  }}
                  transition="0.25s"
                  color="main"
                >
                  My Profile
                </ChakraLink>
              )}
              <Button
                color="whiteAlpha.800"
                bgColor="rgba(0, 0, 0, 0.3)"
                border="none"
                borderRadius="full"
                fontWeight="light"
                onClick={() => {
                  toggleOpen();
                  onSearchOpen();
                }}
                minW="7.5rem"
                justifyContent="flex-start"
              >
                <SearchIcon color="white" mr={3} />
                Search
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
