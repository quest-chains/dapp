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

import { ConnectWallet } from '@/components/ConnectWallet';
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
              <NextLink href="/explore" passHref>
                <ChakraLink display="block" _hover={{}} onClick={toggleOpen}>
                  <Text
                    borderBottomWidth={router.pathname === '/explore' ? 1 : 0}
                    borderBottomColor="main"
                    color={router.pathname === '/explore' ? 'main' : 'inherit'}
                    fontFamily="headingLight"
                  >
                    Explore Quests
                  </Text>
                </ChakraLink>
              </NextLink>
              <NextLink href="/create" passHref>
                <ChakraLink display="block" _hover={{}} onClick={toggleOpen}>
                  <Text
                    borderBottomWidth={router.pathname === '/create' ? 1 : 0}
                    borderBottomColor="main"
                    color={router.pathname === '/create' ? 'main' : 'inherit'}
                    fontFamily="headingLight"
                  >
                    Create Quest Chain
                  </Text>
                </ChakraLink>
              </NextLink>
              {isConnected && (
                <NextLink href={`/profile/${address}`} passHref>
                  <ChakraLink display="block" _hover={{}}>
                    <Text
                      borderBottomWidth={
                        router.query.address === address ? 1 : 0
                      }
                      borderBottomColor="main"
                      color={
                        router.query.address === address ? 'main' : 'inherit'
                      }
                      fontFamily="headingLight"
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
                boxShadow="inset 0px 0px 0px 1px #AD90FF"
                fontWeight="light"
                onClick={() => {
                  toggleOpen();
                  onSearchOpen();
                }}
                minW="7.5rem"
                justifyContent="flex-start"
              >
                <SearchIcon color="main" mr={3} />
                Search
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
