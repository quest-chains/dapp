import { Box, Flex } from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';

import { UserStatusType } from '@/pages/[network]/[address]';

import { UploadProof } from './UploadProof';

type UploadProofButtonProps = {
  userStatus: UserStatusType;
  questChain: graphql.QuestChainInfoFragment;
  quest: graphql.QuestInfoFragment;
  refresh: () => void;
};

export const UploadProofButton: React.FC<UploadProofButtonProps> = ({
  userStatus,
  quest,
  questChain,
  refresh,
}) => (
  <Flex mt={5}>
    {
      // TODO: Also display prev submissions and reviews here
      !userStatus[quest.questId]?.status ||
      userStatus[quest.questId]?.status === 'init' ||
      userStatus[quest.questId]?.status === 'fail' ? (
        <UploadProof
          // TODO: move the modal inside this outside so that we don't render a new Modal for each quest
          quest={quest}
          questChain={questChain}
          refresh={refresh}
        />
      ) : (
        <Box>
          <Box
            color={
              userStatus[quest.questId]?.status === 'review'
                ? 'pending'
                : 'main'
            }
            border="1px solid"
            borderColor={
              userStatus[quest.questId]?.status === 'review'
                ? 'pending'
                : 'main'
            }
            bgColor={
              userStatus[quest.questId]?.status === 'review'
                ? '#EFFF8F20'
                : 'main.100'
            }
            px={4}
            borderRadius={6}
            fontSize="sm"
          >
            {userStatus[quest.questId]?.status === 'review'
              ? 'Review Pending'
              : 'Accepted'}
          </Box>
        </Box>
      )
    }
  </Flex>
);
