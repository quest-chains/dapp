import { SearchIcon } from '@chakra-ui/icons';
import {
  Flex,
  Grid,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import {
  OrderDirection,
  QuestChain_OrderBy,
} from '@quest-chains/sdk/dist/graphql';
import { useMemo, useState } from 'react';

import { QuestChainTile } from '@/components/QuestChainTile';
import { useDelay } from '@/hooks/useDelay';
import { useQuestChainSearchForAllChains } from '@/hooks/useQuestChainSearchForAllChains';

import { LoadingState } from '../LoadingState';

const SearchQuestChains: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [value, setValue] = useState('');
  const delayedSetValue = useDelay(setValue);

  const filters: graphql.QuestChainFiltersInfo = useMemo(() => {
    const f: graphql.QuestChainFiltersInfo = {};
    f.search = value.toLowerCase();

    f.orderBy = QuestChain_OrderBy.UpdatedAt;
    f.orderDirection = OrderDirection.Desc;

    f.onlyEnabled = true;

    return f;
  }, [value]);

  const { fetching, results, error } = useQuestChainSearchForAllChains(filters);

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error while searching for quest chains:', error);
  }

  return (
    <Flex alignItems="flex-start" gap={4} w="full" direction="column" mt={0}>
      <InputGroup
        maxW="2xl"
        size="lg"
        position="fixed"
        zIndex={1}
        w="calc(100% - 30px)"
      >
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
          width="calc(100% - 20px)"
        />
      </InputGroup>

      <VStack w="full" gap={4} flex={1} position="relative" top={20}>
        {fetching && <LoadingState my={12} />}

        <Grid
          gap={5}
          templateColumns={{
            base: 'repeat(1, 100%)',
            md: 'repeat(2,  minmax(0, 1fr))',
          }}
          maxW="full"
          pr={3}
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
                createdBy,
              }) => (
                <QuestChainTile
                  {...{
                    address,
                    name,
                    description,
                    slug,
                    chainId,
                    createdBy: createdBy.id,
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
    </Flex>
  );
};

export default SearchQuestChains;
