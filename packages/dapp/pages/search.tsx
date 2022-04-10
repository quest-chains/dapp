import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useState } from 'react';

import {
  QuestChainInfoFragment,
  useQuestChainSearchQuery,
} from '@/graphql/types';
import { useDelay } from '@/hooks/useDelay';

const Search: React.FC = () => {
  const [value, setValue] = useState('');
  const delayedSetValue = useDelay(setValue);

  const [{ fetching, data, error }] = useQuestChainSearchQuery({
    variables: { search: value.toLowerCase() },
    requestPolicy: 'network-only',
  });

  const results: QuestChainInfoFragment[] = data?.questChains ?? [];

  return (
    <VStack px={40} alignItems="flex-start" gap={4}>
      <Head>
        <title>Search</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Text color="main" fontSize={20} mb={2} textTransform="uppercase">
        Search for Quest Chain
      </Text>
      <InputGroup maxW="2xl" size="lg">
        <InputLeftElement pointerEvents="none">
          {fetching ? (
            <Spinner size="sm" color="main" />
          ) : (
            <SearchIcon color="main" />
          )}
        </InputLeftElement>
        <Input
          backdropFilter="blur(40px)"
          color="white"
          border="none"
          borderRadius="full"
          boxShadow="inset 0px 0px 0px 1px #AD90FF"
          placeholder="Search by name or description"
          onChange={e => delayedSetValue(e.target.value)}
          mb={6}
        />
      </InputGroup>

      {!fetching && (
        <Text fontSize={20} textTransform="uppercase" color="white">
          {error
            ? 'Error: Something went wrong!'
            : `${results.length} Quest Chains found`}
        </Text>
      )}
      <VStack w="full" gap={4} flex={1}>
        {!fetching &&
          !error &&
          results.length > 0 &&
          results.map(({ address, name, description }) => (
            <NextLink
              as={`/quest-chain/${address}`}
              href={`/quest-chain/[address]`}
              passHref
              key={address}
            >
              <ChakraLink display="block" _hover={{}} w="full">
                <HStack
                  cursor="pointer"
                  justify="space-between"
                  w="full"
                  px={10}
                  py={4}
                  background="rgba(255, 255, 255, 0.02)"
                  _hover={{
                    background: 'whiteAlpha.100',
                  }}
                  fontWeight="400"
                  backdropFilter="blur(40px)"
                  borderRadius="full"
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  letterSpacing={4}
                >
                  <Box>
                    <Text mb={4} fontSize="lg" fontWeight="bold" color="main">
                      {name}
                    </Text>
                    <Text>{description}</Text>
                  </Box>
                  {/* <Text>1/20</Text> */}
                </HStack>
              </ChakraLink>
            </NextLink>
          ))}
      </VStack>
    </VStack>
  );
};

export default Search;
