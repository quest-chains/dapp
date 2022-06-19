import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  HStack,
  Link as ChakraLink,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { ConnectWallet } from '@/components/Layout/ConnectWallet';
import { WalletDisplay } from '@/components/Layout/WalletDisplay';
import { useWallet } from '@/web3';

export const DesktopMenu: React.FC<{ onSearchOpen: () => void }> = ({
  onSearchOpen,
}) => {
  const { address, isConnected } = useWallet();
  const router = useRouter();

  const isSmallerScreen = useBreakpointValue({ base: true, xl: false });

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
          color="whiteAlpha.800"
          bgColor="rgba(0, 0, 0, 0.3)"
          border="none"
          borderRadius="full"
          boxShadow="inset 0px 0px 0px 1px #AD90FF"
          fontWeight="light"
          onClick={onSearchOpen}
          minW="7.5rem"
          justifyContent="flex-start"
        >
          <SearchIcon color="main" mr={3} />
          {isSmallerScreen ? 'Search' : 'Search by name or description'}
        </Button>

        <NextLink href="/explore" passHref>
          <ChakraLink display="block" _hover={{}}>
            <Text
              borderBottomWidth={router.pathname === '/explore' ? 1 : 0}
              borderBottomColor="main"
              color={router.pathname === '/explore' ? 'main' : 'inherit'}
              fontFamily="headingLight"
            >
              {isSmallerScreen ? 'Explore' : 'Explore Quests'}
            </Text>
          </ChakraLink>
        </NextLink>
        <NextLink href="/create" passHref>
          <ChakraLink display="block" _hover={{}}>
            <Text
              borderBottomWidth={router.pathname === '/create' ? 1 : 0}
              borderBottomColor="main"
              color={router.pathname === '/create' ? 'main' : 'inherit'}
              fontFamily="headingLight"
            >
              {isSmallerScreen ? 'Create' : 'Create Quest Chain'}
            </Text>
          </ChakraLink>
        </NextLink>
        {isConnected && (
          <NextLink href={`/profile/${address}`} passHref>
            <ChakraLink display="block" _hover={{}}>
              <Text
                borderBottomWidth={router.query.address === address ? 1 : 0}
                borderBottomColor="main"
                color={router.query.address === address ? 'main' : 'inherit'}
                fontFamily="headingLight"
              >
                {isSmallerScreen ? 'Profile' : 'My Profile'}
              </Text>
            </ChakraLink>
          </NextLink>
        )}
      </HStack>

      {isConnected ? <WalletDisplay /> : <ConnectWallet />}
    </>
  );
};
