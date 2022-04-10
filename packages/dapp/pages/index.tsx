/* eslint-disable import/no-unresolved */
import { Button, Flex, Heading, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';

import { ConnectWallet } from '@/components/ConnectWallet';
import { useWallet } from '@/web3';

const Home: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false);

  const { isConnected } = useWallet();

  return (
    <Flex
      h="full"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading color="main" fontSize={87} pb={10}>
        DAOQuest
      </Heading>
      <Head>
        <title>DAOQuest</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Flex>
        {!isConnected && <ConnectWallet />}

        {!isEntered && isConnected && (
          <Button
            ml={6}
            px={20}
            background="rgba(255, 255, 255, 0.05)"
            fontWeight="400"
            backdropFilter="blur(40px)"
            borderRadius="full"
            boxShadow="inset 0px 0px 0px 1px #AD90FF"
            onClick={() => setIsEntered(true)}
            color="main"
            letterSpacing={4}
            fontSize={30}
            height={16}
          >
            enter
          </Button>
        )}
      </Flex>

      {isEntered && (
        <VStack spacing={6}>
          <NextLink href="/search" passHref>
            <Button
              px={20}
              background="rgba(255, 255, 255, 0.05)"
              fontWeight="400"
              backdropFilter="blur(40px)"
              borderRadius="full"
              boxShadow="inset 0px 0px 0px 1px #AD90FF"
              onClick={() => setIsEntered(true)}
              color="main"
              letterSpacing={4}
              fontSize={30}
              height={16}
            >
              search for Quest Chain
            </Button>
          </NextLink>
          <NextLink href="/create" passHref>
            <Button
              px={20}
              background="rgba(255, 255, 255, 0.05)"
              fontWeight="400"
              backdropFilter="blur(40px)"
              borderRadius="full"
              boxShadow="inset 0px 0px 0px 1px #AD90FF"
              onClick={() => setIsEntered(true)}
              color="main"
              letterSpacing={4}
              fontSize={30}
              height={16}
            >
              create Quest Chain
            </Button>
          </NextLink>
          <NextLink href="/overview" passHref>
            <Button
              px={20}
              background="rgba(255, 255, 255, 0.05)"
              fontWeight="400"
              backdropFilter="blur(40px)"
              borderRadius="full"
              boxShadow="inset 0px 0px 0px 1px #AD90FF"
              onClick={() => setIsEntered(true)}
              color="main"
              letterSpacing={4}
              fontSize={30}
              height={16}
            >
              quests overview
            </Button>
          </NextLink>
        </VStack>
      )}
    </Flex>
  );
};

export default Home;
