import { CloseIcon } from '@chakra-ui/icons';
import { Button, Flex, Grid, HStack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { QuestChainTile } from '@/components/QuestChainTile';
import { useQuestChainSearchForAllChains } from '@/hooks/useQuestChainSearchForAllChains';

import { LoadingState } from '../LoadingState';
import FilterDropdown from './FilterDropdown';
import SortDropdown from './SortDropdown';

export enum Category {
  NFT = 'NFT',
  GameFi = 'GameFi',
  DeFi = 'DeFi',
  DAO = 'DAO',
  SocialFi = 'SocialFi',
  Metaverse = 'Metaverse',
  Tools = 'Tools',
  Others = 'Others',
  Ecosystem = 'Ecosystem',
}

export enum Network {
  Polygon = 'Polygon',
  Optimism = 'Optimism',
  Arbitrum = 'Arbitrum',
  Gnosis = 'Gnosis',
}

export enum SortBy {
  Popularity = 'Popularity',
  Newest = 'Newest',
  Oldest = 'Oldest',
}

export type Filter = Record<Category | Network, boolean>;

const QuestChains: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [sortBy, setSortBy] = useState<Record<SortBy, boolean>>({
    [SortBy.Popularity]: false,
    [SortBy.Newest]: true,
    [SortBy.Oldest]: false,
  });

  const [categories, setCategories] = useState<Record<Category, boolean>>({
    [Category.NFT]: false,
    [Category.GameFi]: false,
    [Category.DeFi]: false,
    [Category.DAO]: false,
    [Category.SocialFi]: false,
    [Category.Metaverse]: false,
    [Category.Tools]: false,
    [Category.Others]: false,
    [Category.Ecosystem]: false,
  });

  const [networks, setNetworks] = useState<Record<Network, boolean>>({
    [Network.Polygon]: false,
    [Network.Optimism]: false,
    [Network.Arbitrum]: false,
    [Network.Gnosis]: false,
  });

  const { fetching, results, error } = useQuestChainSearchForAllChains('');

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Error while searching for quest chains:', error);
  }

  return (
    <Flex alignItems="flex-start" gap={4} w="full" direction="column" mt={0}>
      <Flex
        w="full"
        justifyContent="space-between"
        direction={{
          base: 'column',
          md: 'row',
        }}
        gap={4}
      >
        <HStack>
          <FilterDropdown
            filter={categories as Filter}
            setFilters={setCategories}
            label="Categories"
          />
          <FilterDropdown
            filter={networks as Filter}
            setFilters={setNetworks}
            label="Networks"
          />
        </HStack>
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} label="Sort by" />
        {/* <Sort sortBy={sortBy} setSortBy={setSortBy} /> */}
      </Flex>

      <HStack mb={4}>
        {Object.entries(categories)
          .filter(([_, value]) => value)
          .map(([key]) => (
            <FilterButton
              key={key}
              label={key}
              onClick={() => setCategories({ ...categories, [key]: false })}
            />
          ))}
        {Object.entries(networks)
          .filter(([_, value]) => value)
          .map(([key]) => (
            <FilterButton
              key={key}
              label={key}
              onClick={() => setNetworks({ ...networks, [key]: false })}
            />
          ))}
        {/* if there is more than 1 filter active, display a button to clear all filters */}
        {[...Object.values(categories), ...Object.values(networks)].filter(
          v => v,
        ).length > 1 && (
          <FilterButton
            label="Clear all filters"
            bgColor="transparent"
            onClick={() => {
              setCategories({
                [Category.NFT]: false,
                [Category.GameFi]: false,
                [Category.DeFi]: false,
                [Category.DAO]: false,
                [Category.SocialFi]: false,
                [Category.Metaverse]: false,
                [Category.Tools]: false,
                [Category.Others]: false,
                [Category.Ecosystem]: false,
              });
              setNetworks({
                [Network.Polygon]: false,
                [Network.Optimism]: false,
                [Network.Arbitrum]: false,
                [Network.Gnosis]: false,
              });
            }}
          />
        )}
      </HStack>

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

const FilterButton: React.FC<{
  label: string;
  onClick: () => void;
  bgColor?: string;
}> = ({ label, onClick, bgColor = '#0F2E27' }) => (
  <Button
    bgColor={bgColor}
    borderRadius="full"
    px={6}
    borderColor="green.900"
    borderWidth={1}
    gap={2}
    alignItems="center"
    onClick={onClick}
  >
    <CloseIcon boxSize={2} w={3} />
    <Text fontSize="sm">{label}</Text>
  </Button>
);

export default QuestChains;
