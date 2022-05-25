import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

import { useUserQuestsRejectedForAllChains } from '@/hooks/useUserQuestsRejectedForAllChains';

import { UploadProof } from './UploadProof';

export const QuestsRejected: React.FC<{
  address: string;
}> = ({ address }) => {
  const {
    results: questsRejected,
    fetching,
    refresh,
  } = useUserQuestsRejectedForAllChains(address);

  return (
    <VStack spacing={4} align="stretch">
      <Text w="100%" textAlign="left" mb={2} color="main" fontSize={20}>
        REJECTED QUESTS
      </Text>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {questsRejected.length === 0 && (
            <Text color="white">No rejected quests</Text>
          )}
          {questsRejected.map(quest => (
            <Box key={quest.id}>
              <Text>
                {quest.quest.name} ({quest.questChain.name})
              </Text>
              <UploadProof
                address={address}
                questId={quest.quest.questId}
                questChainId={quest.questChain.chainId}
                questChainAddress={quest.questChain.address}
                name={quest.quest.name}
                refresh={refresh}
              />
            </Box>
          ))}
        </>
      )}
    </VStack>
  );
};
