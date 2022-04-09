import { Flex, Heading, Link as ChakraLink } from '@chakra-ui/react';
import NextLink from 'next/link';

const Home: React.FC = () => {
  return (
    <Flex
      h="full"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading color="main" fontSize={87}>
        DAOQuest
      </Heading>
      <NextLink href="/search" passHref>
        <ChakraLink display="block" _hover={{}}>
          Search For DAO
        </ChakraLink>
      </NextLink>
      <NextLink href="/create" passHref>
        <ChakraLink display="block" _hover={{}}>
          Create Quest Chain
        </ChakraLink>
      </NextLink>
      <NextLink href="/overview" passHref>
        <ChakraLink display="block" _hover={{}}>
          Quests overview
        </ChakraLink>
      </NextLink>
    </Flex>
  );
};

export default Home;
