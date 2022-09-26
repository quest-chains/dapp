import { WarningTwoIcon } from '@chakra-ui/icons';
import {
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
import removeMd from 'remove-markdown';

import { UploadProof } from '@/components/UploadProof';
import { useUserQuestsRejectedForAllChains } from '@/hooks/useUserQuestsRejectedForAllChains';
import { useWallet } from '@/web3';

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

export const QuestRejectedStatus: React.FC<{
  statusInfo: graphql.QuestStatusInfoFragment;
  refresh: () => void;
}> = ({ statusInfo, refresh }) => (
  <VStack
    background="rgba(180, 83, 9, 0.2)"
    p={6}
    maxW="32rem"
    borderRadius={8}
    align="stretch"
    gap={2}
  >
    <Flex alignItems="center">
      <WarningTwoIcon color="#F59E0B" mr={2} />

      <Text fontWeight="bold" fontSize={16}>
        Submission in {`"${statusInfo.questChain.name}"`} rejected
      </Text>
    </Flex>
    <Text>
      Your submission of proof for the quest {`"${statusInfo.quest.name}"`} was
      rejected, with the following comment:{' '}
    </Text>
    <Flex bg="blackAlpha.400" w="A00%" my={2} p={4}>
      <Text fontWeight="bold">
        {removeMd(statusInfo.reviews.slice(-1)[0].description ?? '')}
      </Text>
    </Flex>
    {statusInfo.quest.name && (
      <UploadProof
        questId={statusInfo.quest.questId}
        name={statusInfo.quest.name}
        questChain={statusInfo.questChain}
        refresh={refresh}
        profile
      />
    )}
  </VStack>
);
