/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
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
    pause: value.length < 3,
  });

  const results: QuestChainInfoFragment[] = data?.questChains ?? [];

  return (
    <VStack px={40} alignItems="flex-start" gap={4}>
      <Text color="main" fontSize={20}>
        Search for Quest Chain
      </Text>
      <InputGroup maxW="2xl">
        <InputLeftElement pointerEvents="none">
          {fetching ? (
            <Spinner size="sm" color="main" />
          ) : (
            <SearchIcon color="main" />
          )}
        </InputLeftElement>
        <Input
          placeholder="search for Quest Chain"
          onChange={e => delayedSetValue(e.target.value)}
          mb={6}
        />
      </InputGroup>

      {!fetching && !!value && (
        <Text color="main" fontSize={20}>
          {error
            ? 'Error: Something went wrong!'
            : `${results.length} results found`}
        </Text>
      )}
      <VStack w="full" gap={4}>
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
                    background: 'rgba(255, 255, 255, 0.1)',
                  }}
                  fontWeight="400"
                  backdropFilter="blur(40px)"
                  borderRadius="full"
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  letterSpacing={4}
                >
                  <Box>
                    <Text mb={4} fontSize="lg" fontWeight="bold">
                      {name}
                    </Text>
                    <Text>{description}</Text>
                  </Box>
                  <Text>1/20</Text>
                </HStack>
              </ChakraLink>
            </NextLink>
          ))}
      </VStack>
    </VStack>
  );
};

export default Search;
