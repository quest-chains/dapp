import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  HStack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { ConnectWallet } from '@/components/Layout/ConnectWallet';
import { WalletDisplay } from '@/components/Layout/WalletDisplay';
import { useWallet } from '@/web3';

export const DesktopMenu: React.FC<{ onSearchOpen: () => void }> = ({
  onSearchOpen,
}) => {
  const { address, isConnected, user, ens } = useWallet();
  const { asPath } = useRouter();

  const isSmallerScreen = useBreakpointValue({ base: true, xl: false });

  const name = useMemo(
    () => user?.username ?? ens ?? address,
    [user, ens, address],
  );

  const isProfilePath = useMemo(() => {
    if (!asPath.startsWith('/profile/')) return false;
    const param = asPath.slice('/profile/'.length);
    return (
      param === user?.username ||
      param === ens ||
      param.toLowerCase() === address
    );
  }, [asPath, user, ens, address]);

  return (
    <Flex zIndex={2} justify="space-between" w="full">
      <Button
        color="whiteAlpha.800"
        bgColor="whiteAlpha.200"
        border="none"
        borderRadius="full"
        fontWeight="light"
        onClick={onSearchOpen}
        minW="7.5rem"
        justifyContent="flex-start"
        px={6}
      >
        <SearchIcon color="white" mr={3} />
        <Text fontSize="sm" color="whiteAlpha.800">
          {isSmallerScreen ? 'Search' : 'Search chains by name or description'}
        </Text>
      </Button>

      <HStack gap={2}>
        {isConnected && (
          <NextLink as={`/profile/${name}`} href="/profile/[name]" passHref>
            <Text
              px={1}
              cursor="pointer"
              boxShadow={isProfilePath ? '0 4px 2px -2px #1f7165' : 'none'}
              _hover={{
                boxShadow: '0 4px 2px -2px #1f7165',
              }}
              transition="0.25s"
              fontWeight="700"
              color="main"
            >
              {isSmallerScreen ? 'Profile' : 'My Profile'}
            </Text>
          </NextLink>
        )}
        <NextLink href="/explore">
          <Text
            px={1}
            cursor="pointer"
            boxShadow={
              asPath === '/explore' ? '0 4px 2px -2px #1f7165' : 'none'
            }
            _hover={{
              boxShadow: '0 4px 2px -2px #1f7165',
            }}
            transition="0.25s"
            color="main"
            fontWeight="700"
          >
            {isSmallerScreen ? 'Explore' : 'Explore'}
          </Text>
        </NextLink>
        <NextLink href="/create">
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
            <Text fontWeight="700" color="white">
              {isSmallerScreen ? 'Create' : 'Create a chain'}
            </Text>
          </Button>
        </NextLink>
        <Flex pl={10}>
          {isConnected ? <WalletDisplay /> : <ConnectWallet />}
        </Flex>
      </HStack>
    </Flex>
  );
};
