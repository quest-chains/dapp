import { SearchIcon } from '@chakra-ui/icons';
import {
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useState } from 'react';

import { QuestChainTile } from '@/components/QuestChainTile';
import { useDelay } from '@/hooks/useDelay';
import { useQuestChainSearchForAllChains } from '@/hooks/useQuestChainSearchForAllChains';

const Search: React.FC = () => {
  const [value, setValue] = useState('');
  const delayedSetValue = useDelay(setValue);

  const { fetching, results, error } = useQuestChainSearchForAllChains(
    value.toLowerCase(),
  );

  return (
    <VStack px={{ base: 0, lg: 40 }} alignItems="flex-start" gap={4}>
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
            : `${results.length} Quest Chain${
                results.length === 1 ? '' : 's'
              } found`}
        </Text>
      )}
      <VStack w="full" gap={4} flex={1}>
        {!fetching &&
          !error &&
          results.length > 0 &&
          results.map(({ address, name, description, chainId }) => (
            <QuestChainTile
              {...{ address, name, description, chainId }}
              key={address}
            />
          ))}
      </VStack>
    </VStack>
  );
};

export default Search;
