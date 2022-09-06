import { WarningTwoIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';

import { UploadProof } from '@/components/UploadProof';
import { useUserQuestsRejectedForAllChains } from '@/hooks/useUserQuestsRejectedForAllChains';
import { useWallet } from '@/web3';

export const QuestRejectedStatus: React.FC<{
  statusInfo: graphql.QuestStatusInfoFragment;
  refresh: () => void;
}> = ({ statusInfo, refresh }) => (
  <Box background="rgba(180, 83, 9, 0.3)" p={8} maxW="32rem">
    <Flex alignItems="center" mb={3}>
      <WarningTwoIcon color="#F59E0B" mr={3} />

      <Text fontWeight="bold" fontSize={16}>
        Submission in {statusInfo.questChain.name} rejected
      </Text>
    </Flex>
    <Text>
      Your submission of proof for {statusInfo.quest.name} was rejected, with
      the following explanation:{' '}
    </Text>
    <Text fontWeight="bold" mb={3}>
      {statusInfo.reviews.slice(-1)[0].description}
    </Text>
    {statusInfo.quest.name && (
      <UploadProof
        questId={statusInfo.quest.questId}
        name={statusInfo.quest.name}
        questChain={statusInfo.questChain}
        refresh={refresh}
        profile
      />
    )}
  </Box>
);

export const QuestsRejected: React.FC = () => {
  const { address } = useWallet();
  const {
    results: questsRejected,
    fetching,
    refresh,
  } = useUserQuestsRejectedForAllChains(address);

  const {
    isOpen: isOpenSeeAll,
    onOpen: onOpenSeeAll,
    onClose: onCloseSeeAll,
  } = useDisclosure();

  return (
    <VStack spacing={4} align="stretch">
      {fetching ? (
        <Spinner color="main" ml={4} />
      ) : (
        <>
          {questsRejected.length === 0 && (
            <Text color="white" ml={4}>
              No rejected quests
            </Text>
          )}
          {questsRejected.length > 2 && (
            <Button
              variant="ghost"
              whiteSpace="nowrap"
              fontWeight="bold"
              color="main"
              borderRadius="3xl"
              onClick={onOpenSeeAll}
            >
              SEE ALL
            </Button>
          )}
          <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
            {questsRejected.slice(0, 2).map(statusInfo => (
              <QuestRejectedStatus
                key={statusInfo.id}
                statusInfo={statusInfo}
                refresh={refresh}
              />
            ))}
          </SimpleGrid>
        </>
      )}

      <Modal isOpen={isOpenSeeAll} onClose={onCloseSeeAll}>
        <ModalOverlay />
        <ModalContent maxW="72rem">
          <ModalHeader>My Submissions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid gap={8} columns={{ base: 1, md: 2 }}>
              {questsRejected.slice(0, 2).map(statusInfo => (
                <QuestRejectedStatus
                  key={statusInfo.id}
                  statusInfo={statusInfo}
                  refresh={refresh}
                />
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
