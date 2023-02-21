import { HStack, Image, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Header: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <HStack
      w="100%"
      justify="space-between"
      h={20}
      zIndex={1000}
      backdropFilter="blur(8px)"
      pos="fixed"
      px={{ base: 4, md: 4, lg: 12, xl: 32 }}
      background="linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 100%)"
    >
      <NextLink href="/explore" passHref>
        <ChakraLink display="block" _hover={{}} w={16}>
          <Image src="/logo.png" alt="Quest Chains" height={9} />
        </ChakraLink>
      </NextLink>

      {children}
    </HStack>
  );
};
