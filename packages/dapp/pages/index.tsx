import {
  Flex,
  Heading,
  HStack,
  Link as ChakraLink,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Link } from 'react-scroll';

import { BuiltWith } from '@/components/Landing/BuiltWith';
import { Creators } from '@/components/Landing/Creators';
import { How } from '@/components/Landing/How';
import { QuestChains } from '@/components/Landing/QuestChains';
import { What } from '@/components/Landing/What';
import { Who } from '@/components/Landing/Who';

const Index: React.FC = () => {
  const isSmallScreen = useBreakpointValue({ base: true, md: false });

  return (
    <Flex w="100%" h="100%" direction="column" align="center" pos="relative">
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HStack
        w="100%"
        justify="space-between"
        h={20}
        position="fixed"
        zIndex={1000}
        px={10}
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
          <Link
            activeClass="active"
            to="what"
            spy={true}
            smooth={true}
            duration={500}
          >
            <Text fontSize={20} ml={3} cursor="pointer">
              what
            </Text>
          </Link>
          <Link
            activeClass="active"
            to="who"
            spy={true}
            smooth={true}
            duration={500}
          >
            <Text fontSize={20} ml={3} cursor="pointer">
              who
            </Text>
          </Link>
          <Link
            activeClass="active"
            to="how"
            spy={true}
            smooth={true}
            duration={500}
          >
            <Text fontSize={20} ml={3} cursor="pointer">
              how
            </Text>
          </Link>
          <Link
            activeClass="active"
            to="creators"
            spy={true}
            smooth={true}
            duration={500}
            offset={-120}
          >
            <Text fontSize={20} ml={3} cursor="pointer">
              creators
            </Text>
          </Link>
          <Link
            activeClass="active"
            to="questors"
            spy={true}
            smooth={true}
            duration={500}
            offset={-110}
          >
            <Text fontSize={20} ml={3} cursor="pointer">
              questors
            </Text>
          </Link>
        </HStack>
      </HStack>
      <QuestChains />
      <What />
      <Who />
      <How />
      <Creators />
      <BuiltWith />
      <Flex fontSize={36} alignItems="baseline" mb={10}>
        2022
        <Heading mx={4} color="main">
          quest chains.
        </Heading>{' '}
        All right reserved.
      </Flex>
    </Flex>
  );
};

export default Index;
