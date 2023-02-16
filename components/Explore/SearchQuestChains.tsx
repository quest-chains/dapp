import { SearchIcon } from '@chakra-ui/icons';
import {
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { QuestChainTile } from '@/components/QuestChainTile';
import { useDelay } from '@/hooks/useDelay';
import { useQuestChainSearchForAllChains } from '@/hooks/useQuestChainSearchForAllChains';

import { LoadingState } from '../LoadingState';

const SearchQuestChains: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [value, setValue] = useState('');
  const delayedSetValue = useDelay(setValue);

  const { fetching, results, error } = useQuestChainSearchForAllChains(
    value.toLowerCase(),
  );

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error while searching for quest chains:', error);
  }

  return (
    <VStack alignItems="flex-start" gap={4} w="full">
      {/* <InputGroup maxW="2xl" size="lg">
        <InputLeftElement pointerEvents="none">
          {fetching ? (
            <Spinner size="sm" color="white" />
          ) : (
            <SearchIcon color="white" />
          )}
        </InputLeftElement>
        <Input
          backdropFilter="blur(40px)"
          color="white"
          border="none"
          boxShadow="inset 0px 0px 0px 1px gray"
          placeholder="Search chains by name or description"
          onChange={e => delayedSetValue(e.target.value)}
          mb={6}
        />
      </InputGroup> */}

      {!fetching && (
        <Text fontSize={20} textTransform="uppercase" color="white">
          {error
            ? 'Error: Something went wrong!'
            : `${results.length} quest chain${
                results.length === 1 ? '' : 's'
              } found`}
        </Text>
      )}
      <VStack w="full" gap={4} flex={1}>
        {fetching && <LoadingState my={12} />}

        <Grid
          gap={4}
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          }}
        >
          {!fetching &&
            !error &&
            results.length > 0 &&
            results.map(
              ({
                address,
                name,
                description,
                slug,
                chainId,
                quests,
                imageUrl,
              }) => (
                <QuestChainTile
                  {...{
                    address,
                    name,
                    description,
                    slug,
                    chainId,
                    quests: quests.filter(q => !q.paused).length,
                    imageUrl,
                    onClick: onClose,
                  }}
                  key={address}
                />
              ),
            )}
        </Grid>
      </VStack>
    </VStack>
  );
};

export default SearchQuestChains;
