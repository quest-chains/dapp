import {
  Box,
  Button,
  Flex,
  Heading,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';

const Home: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isEntered, setIsEntered] = useState(false);

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

      {!isConnected && (
        <Button
          px={20}
          background="rgba(255, 255, 255, 0.05)"
          fontWeight="400"
          backdropFilter="blur(40px)"
          borderRadius="full"
          boxShadow="inset 0px 0px 0px 1px #AD90FF"
          onClick={() => setIsConnected(true)}
          color="main"
          letterSpacing={4}
          fontSize={30}
          height={16}
        >
          connect
        </Button>
      )}

      {!isEntered && isConnected && (
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
          enter
        </Button>
      )}

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
              search For DAO
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
