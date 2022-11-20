import { ArrowDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Link as ChakraLink,
  Stack,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link } from 'react-scroll';

import { PrimaryButton } from '../PrimaryButton';

export const QuestChains: React.FC = () => {
  return (
    <Stack
      w="full"
      align="center"
      justify="center"
      minH="100vh"
      bgImage="url(/Landing/Hero-Background1.svg)"
      bgPosition="center"
      bgSize="contain"
      backgroundRepeat="no-repeat"
      id="quest-chains"
      pos="relative"
      top={20}
    >
      <Container
        display="flex"
        maxW={{
          base: '100%',
          md: 'xl',
          lg: '7xl',
          '2xl': 'full',
          '4xl': '90%',
        }}
        bgPosition="center"
        bgSize="contain"
        px={{ base: 'inherit', lg: 14 }}
        height="100%"
        alignItems="center"
        justifyContent={{ base: 'center', md: 'flex-start' }}
        position="relative"
      >
        <Box
          position="absolute"
          borderRadius="full"
          right="-100px"
          top="-300px"
          height="600px"
          filter="blur(484px)"
          width={{ base: '300px', md: '600px' }}
          background="#2DF8C7"
          zIndex={-3}
        />
        <Box
          position="absolute"
          borderRadius="full"
          left="-400px"
          bottom="-300px"
          height="600px"
          filter="blur(484px)"
          width={{ base: '300px', md: '600px' }}
          background="#2DF8C7"
          zIndex={-3}
        />
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading
            fontSize={{ base: 70, md: 148 }}
            pb={10}
            fontWeight="normal"
            color="white"
          >
            <VStack>
              <Flex>
                <Image
                  src="/Landing/Star1.svg"
                  alt="star1"
                  width={{ base: 12, md: 20 }}
                />
                Quest
              </Flex>
              <Flex>
                Chains
                <Image
                  src="/Landing/Star2.svg"
                  alt="star2"
                  width={{ base: 20, md: 30 }}
                />
              </Flex>
            </VStack>
          </Heading>
          <Flex gap={3}>
            <NextLink href="/explore" passHref>
              <ChakraLink display="block" _hover={{}}>
                <PrimaryButton
                  px={{ base: 8, md: 12 }}
                  fontSize={20}
                  height={12}
                  borderColor="white"
                  boxShadow="inset 0px 0px 0px 1px white"
                >
                  ENTER APP
                </PrimaryButton>
              </ChakraLink>
            </NextLink>
          </Flex>
          <Stack py={24} justifyContent="center" alignItems="center">
            <Heading as="h1" fontSize={20}>
              Learn more
            </Heading>

            {/* @ts-expect-error */}
            <Link to="what" spy={true} smooth={true} duration={500}>
              <ArrowDownIcon h={10} w={10} cursor="pointer" />
            </Link>
          </Stack>
        </Flex>
      </Container>
    </Stack>
  );
};
