/* eslint-disable import/no-unresolved */
import {
  Box,
  Button,
  HStack,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useState } from 'react';

import { reviews } from '@/utils/mockData';
import { status } from '@/utils/status';

const Overview: React.FC = () => {
  const [tab, setTab] = useState('reviews');

  return (
    <VStack>
      <HStack>
        <Button onClick={() => setTab('reviews')} cursor="pointer">
          Submissions to review
        </Button>
        <Button onClick={() => setTab('progress')} cursor="pointer">
          My Progress
        </Button>
      </HStack>

      {tab === 'reviews' && (
        <Box>
          {reviews.map(person => (
            <NextLink href={`/review/${person.id}`} passHref key={person.id}>
              <ChakraLink display="block" _hover={{}}>
                <Box
                  p={4}
                  borderRadius={8}
                  bgColor="rgba(255, 255, 255, 0.02)"
                  mb={2}
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
        </Box>
      )}
      {tab === 'progress' && <Box>PROGRESS CONTENT</Box>}
    </VStack>
  );
};

export default Overview;
