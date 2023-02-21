import { Flex, Grid, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { QuestChainTile } from '@/components/QuestChainTile';
import { useQuestChainSearchForAllChains } from '@/hooks/useQuestChainSearchForAllChains';

import { LoadingState } from '../LoadingState';
import Filters from './Filters';
import Sort from './Sort';

const QuestChains: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [category, setCategory] = useState('');
  const [chain, setChain] = useState('');
  const [nftType, setNftType] = useState('');
  const [verified, setVerified] = useState('');
  const [sortBy, setSortBy] = useState('');

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
        mb={4}
      >
        <Filters
          category={category}
          setCategory={setCategory}
          chain={chain}
          setChain={setChain}
          nftType={nftType}
          setNftType={setNftType}
          verified={verified}
          setVerified={setVerified}
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
