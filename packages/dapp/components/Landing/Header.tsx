import { Button, HStack, Link as ChakraLink, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from 'react-scroll';

import { Header as HeaderComponent } from '@/components/Header';

export const Header: React.FC = () => (
  <HeaderComponent landing>
    <HStack>
      <NextLink href="/explore" passHref>
        <ChakraLink display="block" _hover={{}}>
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
  </HeaderComponent>
);
