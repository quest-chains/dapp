import { HStack, Link as ChakraLink, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { WalletDisplay } from './WalletDisplay';

export const DesktopMenu: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <HStack
        spacing={{ base: 2, lg: 6 }}
        pos="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={1500}
      >
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

      <WalletDisplay />
    </>
  );
};
