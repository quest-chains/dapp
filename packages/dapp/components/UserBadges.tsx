import { HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

import { useUserBadgesForAllChains } from '@/hooks/useUserBadgesForAllChains';

import { NetworkDisplay } from './NetworkDisplay';
import { TokenImageOrVideo } from './TokenImage/TokenImageOrVideo';

type QuestChainBadgeInfo = {
  chainId: string;
  name?: string | null | undefined;
  description?: string | null | undefined;
  imageUrl: string;
};

export const UserBadges: React.FC<{
  address: string;
}> = ({ address }) => {
  const { fetching, results: userBadges } = useUserBadgesForAllChains(address);

  const badges: QuestChainBadgeInfo[] = useMemo(
    () =>
      userBadges?.reduce((t, a) => {
        const badges =
          a?.tokens.map(b => ({
            ...b,
            chainId: a.chainId,
            imageUrl: b.imageUrl ?? '',
          })) ?? [];
        t.push(...badges);
        return t;
      }, new Array<QuestChainBadgeInfo>()) ?? [],
    [userBadges],
  );

  return (
    <VStack spacing={4} align="stretch">
      <Text w="100%" textAlign="left" mb={2} color="main" fontSize={20}>
        BADGES
      </Text>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <HStack spacing={4} align="stretch">
          {badges.length === 0 && <Text color="white">No badges found</Text>}
          {badges?.map(({ chainId, name, imageUrl }) => (
            <VStack
              key={address}
              gap={3}
              alignItems="center"
              boxShadow="inset 0px 0px 0px 1px #AD90FF"
              p={8}
              borderRadius={20}
            >
              <TokenImageOrVideo uri={imageUrl} w="10rem" height="10rem" />
              <HStack>
                <Text>{name}</Text>
                <NetworkDisplay chainId={chainId} asTag />
              </HStack>
            </VStack>
          ))}
        </HStack>
      )}
    </VStack>
  );
};
