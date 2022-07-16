import { VStack } from '@chakra-ui/react';
import Head from 'next/head';

import SearchQuestChains from '@/components/SearchQuestChains';

const Explore: React.FC = () => {
  return (
    <VStack px={{ base: 0, lg: 40 }} alignItems="flex-start" gap={4}>
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SearchQuestChains />
    </VStack>
  );
};

export default Explore;
