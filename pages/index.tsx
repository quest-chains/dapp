import { Flex, Heading } from '@chakra-ui/react';

import { BuiltWith } from '@/components/Landing/BuiltWith';
import { Creators } from '@/components/Landing/Creators';
import { How } from '@/components/Landing/How';
import { QuestChains } from '@/components/Landing/QuestChains';
import { Team } from '@/components/Landing/Team';
import { What } from '@/components/Landing/What';
import { Who } from '@/components/Landing/Who';
import { HeadComponent } from '@/components/Seo';

const Index: React.FC = () => {
  return (
    <Flex w="100%" h="100%" direction="column" align="center" pos="relative">
      <HeadComponent />
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
