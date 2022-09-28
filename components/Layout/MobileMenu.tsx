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
  const router = useRouter();
  const { isConnected, address } = useWallet();

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
              <NextLink href="/create" passHref>
                <ChakraLink display="block" _hover={{}} onClick={toggleOpen}>
                  <Button
                    borderWidth={1}
                    bg="none"
                    borderColor={
                      router.pathname === '/create' ? 'main' : 'white'
                    }
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
              </NextLink>
              <NextLink href="/explore" passHref>
                <ChakraLink display="block" _hover={{}} onClick={toggleOpen}>
                  <Text
                    color="main"
                    boxShadow={
                      router.pathname === '/explore'
                        ? '0 4px 2px -2px #1f7165'
                        : 'none'
                    }
                    _hover={{
                      boxShadow: '0 4px 2px -2px #1f7165',
                    }}
                    transition="0.25s"
                  >
                    Explore
                  </Text>
                </ChakraLink>
              </NextLink>
              {isConnected && (
                <NextLink href={`/profile/${address}`} passHref>
                  <ChakraLink display="block" _hover={{}}>
                    <Text
                      boxShadow={
                        router.query.address?.toString()?.toLowerCase() ===
                        address?.toLowerCase()
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
                    </Text>
                  </ChakraLink>
                </NextLink>
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
