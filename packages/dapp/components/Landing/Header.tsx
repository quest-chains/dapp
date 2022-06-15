import {
  Button,
  Heading,
  HStack,
  Link as ChakraLink,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from 'react-scroll';

export const Header: React.FC = () => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <HStack
      w="100%"
      justify="space-between"
      h={20}
      position="fixed"
      zIndex={1000}
      px={10}
      background="linear-gradient(rgba(255, 255, 255, 0.2), transparent)"
      boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
      backdropFilter="blur(5px)"
      borderBottom="1px solid rgba(255, 255, 255, 0.01)"
    >
      <NextLink href="/" passHref>
        <ChakraLink display="block" _hover={{}} zIndex={1500}>
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

      <HStack>
        <NextLink href="/explore" passHref>
          <ChakraLink display="block" _hover={{}} zIndex={1500}>
            <Button
              fontSize={20}
              ml={3}
              cursor="pointer"
              fontFamily="headingLight"
            >
              Explore Quests
            </Button>
          </ChakraLink>
        </NextLink>

        <Link
          activeClass="active"
          to="what"
          spy={true}
          smooth={true}
          duration={500}
        >
          <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
            What
          </Text>
        </Link>
        <Link
          activeClass="active"
          to="who"
          spy={true}
          smooth={true}
          duration={500}
        >
          <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
            Who
          </Text>
        </Link>
        <Link
          activeClass="active"
          to="how"
          spy={true}
          smooth={true}
          duration={500}
        >
          <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
            How
          </Text>
        </Link>
        <Link
          activeClass="active"
          to="creators"
          spy={true}
          smooth={true}
          duration={500}
          offset={-70}
        >
          <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
            Creators
          </Text>
        </Link>
        <Link
          activeClass="active"
          to="questers"
          spy={true}
          smooth={true}
          duration={500}
          offset={-110}
        >
          <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
            Questers
          </Text>
        </Link>
        <Link
          activeClass="active"
          to="team"
          spy={true}
          smooth={true}
          duration={500}
        >
          <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
            Team
          </Text>
        </Link>
      </HStack>
    </HStack>
  );
};
