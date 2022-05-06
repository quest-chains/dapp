import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  HStack,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

import { ConnectWallet } from '@/components/ConnectWallet';
import { useWallet } from '@/web3';

import SearchQuestChains from './SearchQuestChains';
import { WalletDisplay } from './WalletDisplay';

export const DesktopMenu: React.FC = () => {
  const { isConnected } = useWallet();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUserKeyPress = useCallback(
    (event: { key: string; metaKey: boolean }) => {
      const { key, metaKey } = event;
      if (metaKey && key === 'k') {
        if (isOpen) onClose();
        else onOpen();
      }
    },
    [isOpen, onClose, onOpen],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <>
      <HStack
        spacing={{ base: 2, lg: 6 }}
        pos="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={2}
      >
        <Button
          backdropFilter="blur(40px)"
          color="whiteAlpha.300"
          bgColor="transparent"
          border="none"
          borderRadius="full"
          boxShadow="inset 0px 0px 0px 1px #AD90FF"
          onClick={onOpen}
        >
          <SearchIcon color="main" mr={3} />
          Search by name or description
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent maxW="2xl">
            <ModalBody py={6}>
              <SearchQuestChains />
            </ModalBody>
          </ModalContent>
        </Modal>
        <NextLink href="/explore" passHref>
          <ChakraLink display="block" _hover={{}}>
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
          <ChakraLink display="block" _hover={{}}>
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
          <ChakraLink display="block" _hover={{}}>
            <Text
              borderBottomWidth={router.pathname === '/overview' ? 1 : 0}
              borderBottomColor="main"
              color={router.pathname === '/overview' ? 'main' : 'inherit'}
            >
              OVERVIEW
            </Text>
          </ChakraLink>
        </NextLink>
      </HStack>

      {isConnected ? <WalletDisplay /> : <ConnectWallet />}
    </>
  );
};
