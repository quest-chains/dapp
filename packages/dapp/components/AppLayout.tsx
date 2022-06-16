import { Flex, Stack, useBreakpointValue, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Header } from '@/components/Header';
import { HeaderLanding } from '@/components/Landing/HeaderLanding';
import { useWallet } from '@/web3';

import { DesktopMenu } from './DesktopMenu';
import { MobileMenu } from './MobileMenu';
import { NavToggle } from './NavToggle';

export const AppLayout: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { isConnected } = useWallet();
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(o => !o);
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  const isLanding = router.pathname === '/';

  return (
    <Stack align="center" p={0} m={0} spacing={0} fontFamily="body">
      {!isLanding && (
        <VStack alignItems="center" borderBottomRadius="md" w="100%" mx="auto">
          <Header>
            {isSmallScreen ? (
              <>
                <NavToggle isOpen={isOpen} onClick={toggleOpen} zIndex={1500} />
                <MobileMenu isOpen={isOpen} onClose={toggleOpen} />
              </>
            ) : (
              <DesktopMenu />
            )}
          </Header>
        </VStack>
      )}
      {!isLanding && (
        <Flex
          direction="column"
          w="100%"
          flex={1}
          overflowX="hidden"
          visibility={
            isOpen && isSmallScreen && isConnected ? 'hidden' : 'visible'
          }
          pos="relative"
          top={20}
          py="2.75rem !important"
          opacity={isOpen && isSmallScreen && isConnected ? 0 : 1}
          transition="opacity 0.25s"
        >
          {children}
        </Flex>
      )}

      {isLanding && <HeaderLanding />}
      {isLanding && (
        <Flex
          direction="column"
          w="100%"
          flex={1}
          overflowX="hidden"
          visibility={
            isOpen && isSmallScreen && isConnected ? 'hidden' : 'visible'
          }
          opacity={isOpen && isSmallScreen && isConnected ? 0 : 1}
          transition="opacity 0.25s"
        >
          {children}
        </Flex>
      )}
    </Stack>
  );
};
