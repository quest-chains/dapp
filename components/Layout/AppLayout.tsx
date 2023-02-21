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

import SearchQuestChains from '@/components/Explore/SearchQuestChains';
import { MenuLandingDesktop } from '@/components/Landing/MenuLandingDesktop';
import { MenuLandingMobile } from '@/components/Landing/MenuLandingMobile';
import { Footer } from '@/components/Layout/Footer';
import { Header } from '@/components/Layout/Header';

import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';

export const AppLayout: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
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
      fontFamily="body"
      minH="100vh"
      w="100%"
      justify="space-between"
    >
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
      {!isLanding && (
        <Flex
          direction="column"
          w="100%"
          pt="6rem"
          pb={8}
          px={{ base: 4, md: 4, lg: 12, xl: 32 }}
        >
          {children}
        </Flex>
      )}

      {isLanding && (
        <Flex
          direction="column"
          w="100%"
          transition="opacity 0.25s"
          overflowX="hidden"
        >
          {children}
        </Flex>
      )}
      <Footer />
      <Modal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="44rem">
          <ModalBody py={2} m={4} p={0}>
            <SearchQuestChains onClose={onSearchClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};
