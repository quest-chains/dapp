import { Flex, Heading } from '@chakra-ui/react';
import Head from 'next/head';

import { BuiltWith } from '@/components/Landing/BuiltWith';
import { Creators } from '@/components/Landing/Creators';
import { How } from '@/components/Landing/How';
import { QuestChains } from '@/components/Landing/QuestChains';
import { Team } from '@/components/Landing/Team';
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
      <Team />
      <BuiltWith />
      <Flex
        fontSize={{ base: 18, md: 36 }}
        mb={{ base: 4, md: 10 }}
        alignItems="center"
      >
        2022
        <Heading mx={4} color="main" fontSize={{ base: 18, md: 38 }}>
          Quest Chains.
        </Heading>{' '}
        All rights reserved.
      </Flex>
    </Flex>
  );
};

export default Index;
