import { Flex } from '@chakra-ui/react';

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
    </Flex>
  );
};

export default Index;
