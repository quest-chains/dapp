import {
  Heading,
  HStack,
  Image,
  Link as ChakraLink,
  useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export const Header: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <HStack
      w="100%"
      justify="space-between"
      h={20}
      zIndex={1000}
      px={8}
      background="linear-gradient(rgba(255, 255, 255, 0.1), transparent)"
      backdropFilter="blur(8px)"
      pos="fixed"
    >
      <NextLink href="/" passHref>
        <ChakraLink display="block" _hover={{}} w={16}>
          <Image src="/logo.png" alt="Quest Chains" height={9} />
        </ChakraLink>
      </NextLink>

      {children}
    </HStack>
  );
};
