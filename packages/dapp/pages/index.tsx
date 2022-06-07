import { Flex } from '@chakra-ui/react';
import Head from 'next/head';

import { Creators } from '@/components/Landing/Creators';
import { How } from '@/components/Landing/How';
import { QuestChains } from '@/components/Landing/QuestChains';
import { What } from '@/components/Landing/What';
import { Who } from '@/components/Landing/Who';

const Index: React.FC = () => {
  return (
    <Flex w="100%" h="100%" direction="column" align="center" pos="relative">
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <QuestChains />
      <What />
      <Who />
      <How />
      <Creators />
    </Flex>
  );
};

export default Index;
