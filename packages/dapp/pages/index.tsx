import { Flex, Heading, Link as ChakraLink, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';

import { PrimaryButton } from '@/components/PrimaryButton';

const Explore: React.FC = () => {
  return (
    <Stack
      align="center"
      p="0"
      m="0"
      spacing="0"
      fontFamily="body"
      minH="100vh"
    >
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Flex
        flex={1}
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Heading color="main" fontSize={87} pb={10} fontWeight="normal">
          Quest Chains
        </Heading>
        <Flex gap={3}>
          <NextLink href="/explore" passHref>
            <ChakraLink display="block" _hover={{}} zIndex={1500}>
              <PrimaryButton>explore</PrimaryButton>
            </ChakraLink>
          </NextLink>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default Explore;
