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
import { useFilteredQuestChains } from '@/hooks/useFilteredQuestChains';

import { LoadingState } from '../LoadingState';
import Filters from './Filters';
import Sort, { SortBy } from './Sort';

const QuestChains: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [value, setValue] = useState('');
  const delayedSetValue = useDelay(setValue);
  const [category, setCategory] = useState<string | undefined>();
  const [network, setNetwork] = useState<string | undefined>();
  // const [nftType, setNftType] = useState('');
  // const [verified, setVerified] = useState('');
  const [sortBy, setSortBy] = useState('');

  const filters: graphql.QuestChainFiltersInfo = useMemo(() => {
    const f: graphql.QuestChainFiltersInfo = {};
    if (value) {
      f.search = value.toLowerCase();
    }
    if (category) {
      f.categories = [category];
    }

    if (sortBy) {
      if (sortBy === SortBy.Newest) {
        f.orderBy = QuestChain_OrderBy.UpdatedAt;
        f.orderDirection = OrderDirection.Desc;
      } else if (sortBy === SortBy.Oldest) {
        f.orderBy = QuestChain_OrderBy.UpdatedAt;
        f.orderDirection = OrderDirection.Asc;
      }
    }

    f.onlyEnabled = true;

    return f;
  }, [value, category, sortBy]);

  const { fetching, results, error } = useFilteredQuestChains(filters, network);

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error while searching for quest chains:', error);
  }

  return (
    <Flex alignItems="flex-start" gap={4} w="full" direction="column" mt={0}>
      <InputGroup maxW="2xl" size="lg">
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
      </InputGroup>
      <Flex
        w="full"
        justifyContent="space-between"
        direction={{
          base: 'column',
          md: 'row',
        }}
        gap={4}
        mb={4}
      >
        <Filters
          category={category}
          setCategory={setCategory}
          network={network}
          setNetwork={setNetwork}
        />
        <Sort sortBy={sortBy} setSortBy={setSortBy} />
      </Flex>

      <VStack w="full" gap={4} flex={1}>
        {fetching && <LoadingState my={12} />}

        <Grid
          gap={5}
          templateColumns={{
            base: 'repeat(1, 100%)',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          }}
          maxW="full"
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

export default QuestChains;
