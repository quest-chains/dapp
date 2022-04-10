/* eslint-disable import/no-unresolved */
import {
  Flex,
  Link as ChakraLink,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';

import { QuestsToReview } from '@/components/QuestsToReview';
import { progress } from '@/utils/mockData';

const Overview: React.FC = () => {
  return (
    <SimpleGrid columns={2} spacing={8}>
      <Head>
        <title>Quests Overview</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* left */}
      <VStack spacing={4} align="stretch">
        <Text mb={2} mx={8} color="main" fontSize={20}>
          MY PROGRESS
        </Text>
        {progress.map(dao => (
          <NextLink href={`/quest-chain/${dao.name}`} passHref key={dao.name}>
            <ChakraLink display="block" _hover={{}}>
              <Flex
                mb={2}
                flexGrow={1}
                boxShadow="inset 0px 0px 0px 1px #AD90FF"
                p={8}
                borderRadius={20}
                justify="space-between"
                _hover={{
                  background: 'whiteAlpha.100',
                }}
              >
                <Flex flexDir="column">
                  <Text>{dao.name}</Text>
                  <Text>{dao.questChainName}</Text>
                </Flex>
                {dao.completed} / {dao.total}
              </Flex>
            </ChakraLink>
          </NextLink>
        ))}
      </VStack>

      {/* right */}
      <QuestsToReview />
    </SimpleGrid>
  );
};

export default Overview;
