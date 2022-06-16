import {
  Heading,
  HStack,
  Link as ChakraLink,
  useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';

export const Header: React.FC<{ children: JSX.Element; landing?: boolean }> = ({
  children,
  landing,
}) => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <HStack
      w="100%"
      justify="space-between"
      h={20}
      zIndex={1000}
      px={10}
      background="linear-gradient(rgba(255, 255, 255, 0.2), transparent)"
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
      backdropFilter="blur(5px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.01)"
      pos={landing ? 'fixed' : 'relative'}
    >
      <NextLink href="/" passHref>
        <ChakraLink display="block" _hover={{}}>
          <Heading
            color="main"
            fontSize={isSmallScreen ? '5xl' : '3xl'}
            fontWeight="normal"
            lineHeight="1rem"
          >
            {isSmallScreen ? 'Q' : 'Quest Chains'}
          </Heading>
        </ChakraLink>
      </NextLink>

      {children}
    </HStack>
  );
};
