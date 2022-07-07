import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
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
      <Flex zIndex={2} justify="space-between" w="full" px={10}>
        <Button
          color="whiteAlpha.800"
          bgColor="whiteAlpha.200"
          border="none"
          borderRadius="8px"
          fontWeight="light"
          onClick={onSearchOpen}
          minW="7.5rem"
          justifyContent="flex-start"
          px={8}
        >
          <SearchIcon color="white" mr={3} />
          <Text fontSize="xs" fontWeight="700" color="whiteAlpha.600">
            {isSmallerScreen
              ? 'search'
              : 'search chains by name or description'}
          </Text>
        </Button>

        <HStack gap={4}>
          {isConnected && (
            <NextLink href={`/profile/${address}`} passHref>
              <ChakraLink display="block" _hover={{}}>
                <Text
                  borderBottomWidth={router.query.address === address ? 1 : 0}
                  borderBottomColor="main"
                  fontWeight="700"
                  color="main"
                >
                  {isSmallerScreen ? 'Profile' : 'My Profile'}
                </Text>
              </ChakraLink>
            </NextLink>
          )}
          <NextLink href="/explore" passHref>
            <ChakraLink display="block" _hover={{}}>
              <Text
                borderBottomWidth={router.pathname === '/explore' ? 1 : 0}
                borderBottomColor="main"
                color="main"
                fontWeight="700"
              >
                {isSmallerScreen ? 'Explore' : 'Explore'}
              </Text>
            </ChakraLink>
          </NextLink>
          <NextLink href="/create" passHref>
            <ChakraLink display="block" _hover={{}}>
              <Box
                borderWidth={1}
                borderColor="white"
                px={5}
                py={2}
                borderRadius="full"
              >
                <Text
                  borderBottomWidth={router.pathname === '/create' ? 1 : 0}
                  borderBottomColor="main"
                  fontWeight="700"
                  color="white"
                >
                  {isSmallerScreen ? 'Create' : 'Create a chain'}
                </Text>
              </Box>
            </ChakraLink>
          </NextLink>
        </HStack>
      </Flex>

      {isConnected ? <WalletDisplay /> : <ConnectWallet />}
    </>
  );
};
