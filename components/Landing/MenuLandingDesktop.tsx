import {
  Button,
  Flex,
  HStack,
  Image,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from 'react-scroll';

export const MenuLandingDesktop: React.FC = () => (
  <HStack>
    <NextLink href="/explore" passHref>
      <ChakraLink display="block" _hover={{}}>
        <Button fontSize={20} cursor="pointer" fontFamily="headingLight">
          Enter App
        </Button>
      </ChakraLink>
    </NextLink>

    {/* @ts-expect-error */}
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
    {/* @ts-expect-error */}
    <Link activeClass="active" to="who" spy={true} smooth={true} duration={500}>
      <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
        Who
      </Text>
    </Link>
    {/* @ts-expect-error */}
    <Link activeClass="active" to="how" spy={true} smooth={true} duration={500}>
      <Text fontSize={20} ml={3} cursor="pointer" fontFamily="headingLight">
        How
      </Text>
    </Link>
    {/* @ts-expect-error */}
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
    {/* @ts-expect-error */}
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
    {/* @ts-expect-error */}
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
    <Flex mb={8}>
      <ChakraLink
        href="https://discord.gg/sjnh6cuVcN"
        isExternal
        borderRadius="full"
        mx={4}
      >
        <Image src="/Landing/contact/discord.png" alt="discord" height={8} />
      </ChakraLink>
      <ChakraLink
        href="https://twitter.com/questchainz"
        isExternal
        borderRadius="full"
      >
        <Image src="/Landing/contact/twitter.png" alt="twitter" height={8} />
      </ChakraLink>
    </Flex>
  </HStack>
);
