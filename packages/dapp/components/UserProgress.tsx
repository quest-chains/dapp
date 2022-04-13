import {
  Flex,
  HStack,
  Link as ChakraLink,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';

import {
  QuestChainInfoFragment,
  QuestStatusInfoFragment,
  useStatusForUserQuery,
} from '@/graphql/types';
import { useWallet } from '@/web3';

type UserStatus = {
  chain: QuestChainInfoFragment;
  completed: number;
  total: number;
};

export const UserProgress = () => {
  const { address } = useWallet();
  const [{ data, fetching }] = useStatusForUserQuery({
    variables: { user: address?.toLowerCase() ?? '', first: 1000 },
  });

  const userStatuses: UserStatus[] = useMemo(() => {
    const statuses: Record<string, QuestStatusInfoFragment[]> = {};
    data?.questStatuses.forEach(qs => {
      const arr = statuses[qs.questChain.address] ?? [];
      statuses[qs.questChain.address] = [...arr, qs];
    });
    return Object.values(statuses)
      .filter(value => value.length !== 0)
      .map(value => {
        const chain = value[0].questChain;
        const total = chain.quests.length;
        const completed = value.reduce(
          (t, a) => t + (a.status === 'pass' ? 1 : 0),
          0,
        );
        return { chain, completed, total };
      });
  }, [data]);

  return (
    <VStack spacing={4} align="stretch">
      <Text w="100%" textAlign="center" mb={2} color="main" fontSize={20}>
        MY PROGRESS
      </Text>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {userStatuses.length === 0 && (
            <VStack w="100%">
              <Text color="white">No progress found</Text>
            </VStack>
          )}
          {userStatuses.map(us => (
            <NextLink
              as={`/chain/${us.chain.address}`}
              href={`/chain/[address]`}
              passHref
              key={us.chain.address}
            >
              <ChakraLink display="block" _hover={{}}>
                <HStack
                  mb={2}
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  p={8}
                  borderRadius={20}
                  _hover={{
                    background: 'whiteAlpha.100',
                  }}
                  align="flex-start"
                  justify="space-between"
                >
                  <Flex flexDir="column">
                    <Text color="main" fontWeight="bold" fontSize="lg" mb={4}>
                      {us.chain.name}
                    </Text>
                    <Text>{us.chain.description}</Text>
                  </Flex>
                  <Text>
                    {us.completed} / {us.total}
                  </Text>
                </HStack>
              </ChakraLink>
            </NextLink>
          ))}
        </>
      )}
    </VStack>
  );
};
