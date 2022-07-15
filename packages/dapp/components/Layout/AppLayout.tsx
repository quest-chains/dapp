import {
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { MenuLandingDesktop } from '@/components/Landing/MenuLandingDesktop';
import { MenuLandingMobile } from '@/components/Landing/MenuLandingMobile';
import { Header } from '@/components/Layout/Header';
import SearchQuestChains from '@/components/SearchQuestChains';
import { useWallet } from '@/web3';

import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';

export const AppLayout: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { isConnected } = useWallet();
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(o => !o);
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, lg: false });

  const isLanding = router.pathname === '/';
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const handleUserKeyPress = useCallback(
    (event: { key: string; metaKey: boolean }) => {
      const { key, metaKey } = event;
      if (metaKey && key === 'k') {
        if (isSearchOpen) onSearchClose();
        else onSearchOpen();
      }
    },
    [isSearchOpen, onSearchClose, onSearchOpen],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  return (
    <Stack
      align="center"
      p={0}
      m={0}
      spacing={0}
      fontFamily="body"
      minH="100vh"
    >
      {/* {!isLanding && ( */}
      <Header>
        {isSmallScreen ? (
          isLanding ? (
            <MenuLandingMobile />
          ) : (
            <MobileMenu
              isOpen={isOpen}
              toggleOpen={toggleOpen}
              onSearchOpen={onSearchOpen}
            />
          )
        ) : isLanding ? (
          <MenuLandingDesktop />
        ) : (
          <DesktopMenu onSearchOpen={onSearchOpen} />
        )}
      </Header>
      {/* )} */}
      {!isLanding && (
        <Flex
          direction="column"
          w="100%"
          visibility={
            isOpen && isSmallScreen && isConnected ? 'hidden' : 'visible'
          }
          pos="relative"
          top={20}
          py="2.75rem !important"
          opacity={isOpen && isSmallScreen && isConnected ? 0 : 1}
          transition="opacity 0.25s"
          p={{ base: 4, sm: 8, lg: 0 }}
          maxW="8xl"
        >
          {children}
        </Flex>
      )}

      {isLanding && (
        <Flex
          direction="column"
          w="100%"
          flex={1}
          visibility={
            isOpen && isSmallScreen && isConnected ? 'hidden' : 'visible'
          }
          opacity={isOpen && isSmallScreen && isConnected ? 0 : 1}
          transition="opacity 0.25s"
          overflowX="hidden"
        >
          {children}
        </Flex>
      )}
      <Modal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="44rem">
          <ModalBody py={2} m={4}>
            <SearchQuestChains onClose={onSearchClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};
