/* eslint-disable import/no-unresolved */
import {
  Box,
  Flex,
  HStack,
  Link as ChakraLink,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';

import { progress, reviews } from '@/utils/mockData';
import { status } from '@/utils/status';

const Overview: React.FC = () => {
  return (
    <SimpleGrid columns={2} spacing={8}>
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
      <VStack spacing={4} align="stretch">
        <Text mb={2} mx={8} color="main" fontSize={20}>
          SUBMISSIONS TO REVIEW
        </Text>
        {reviews.map(person => (
          <NextLink href={`/review/${person.id}`} passHref key={person.id}>
            <ChakraLink display="block" _hover={{}}>
              <Box
                mb={2}
                boxShadow="inset 0px 0px 0px 1px #AD90FF"
                p={8}
                borderRadius={20}
              >
                Address: {person.address}
                <HStack>
                  <Box>
                    Pending:{' '}
                    {
                      person.submissions.filter(
                        submission => submission.status === status.pending,
                      ).length
                    }
                  </Box>
                  <Box>
                    Accepted:{' '}
                    {
                      person.submissions.filter(
                        submission => submission.status === status.accepted,
                      ).length
                    }
                  </Box>
                  <Box>
                    Rejected:{' '}
                    {
                      person.submissions.filter(
                        submission => submission.status === status.rejected,
                      ).length
                    }
                  </Box>
                </HStack>
              </Box>
            </ChakraLink>
          </NextLink>
        ))}
      </VStack>
    </SimpleGrid>
  );
};

export default Overview;
