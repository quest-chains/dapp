import {
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ConnectWallet } from '@/components/ConnectWallet';
import { useWallet } from '@/web3';

import { NavToggle } from './NavToggle';
import { WalletDisplay } from './WalletDisplay';

export const Menu: React.FC = () => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== '/' && (
        <HStack gap={6}>
          <NextLink href="/search" passHref>
            <ChakraLink display="block" _hover={{}}>
              <Text
                borderBottomWidth={router.pathname === '/search' ? 1 : 0}
                borderBottomColor="main"
                color={router.pathname === '/search' ? 'main' : 'inherit'}
              >
                SEARCH
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
      )}

      <WalletDisplay />
    </>
  );
};

export const AppLayout: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const { isConnected } = useWallet();
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(o => !o);
  const router = useRouter();
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <Stack
      align="center"
      p="0"
      m="0"
      spacing="0"
      fontFamily="body"
      minH="100vh"
    >
      <VStack
        p={{ base: 6, lg: 8 }}
        alignItems="center"
        borderBottomRadius="md"
        w="100%"
        mx="auto"
        maxW="9xl"
      >
        {isConnected && (
          <HStack w="100%" justify="space-between" pos="relative">
            <NextLink href="/" passHref>
              <ChakraLink display="block" _hover={{}} w="20%">
                {router.pathname !== '/' && (
                  <Heading color="main" fontSize={30} fontWeight="normal">
                    {isSmallScreen ? 'Q' : 'DAOQuest'}
                  </Heading>
                )}
              </ChakraLink>
            </NextLink>
            <Menu />
            {isSmallScreen && (
              <NavToggle isOpen={isOpen} onClick={toggleOpen} />
            )}
          </HStack>
        )}
      </VStack>
      <Flex
        direction="column"
        w="100%"
        pt={{ base: 6, md: 8, lg: 12 }}
        px={8}
        pb={20}
        maxW="8xl"
        mx="auto"
        flex={1}
        overflowX="hidden"
      >
        {isConnected ? (
          children
        ) : (
          <Flex
            flex={1}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Heading color="main" fontSize={87} pb={10} fontWeight="normal">
              DAOQuest
            </Heading>
            <ConnectWallet />
          </Flex>
        )}
      </Flex>
    </Stack>
  );
};
