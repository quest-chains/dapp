import { Box, Flex } from '@chakra-ui/react';

import { QuestChainInfoFragment } from '@/graphql/types';
import { UserStatusType } from '@/pages/chain/[chainId]/[address]';

import { CollapsableText } from './CollapsableText';
import { MarkdownViewer } from './MarkdownViewer';
import { UploadProof } from './UploadProof';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type CollapsableQuestDisplayProps = {
  userStatus: UserStatusType;
  questChain: QuestChainInfoFragment;
  quest: ArrayElement<QuestChainInfoFragment['quests']>;
  refresh: () => void;
};

export const CollapsableQuestDisplay: React.FC<
  CollapsableQuestDisplayProps
> = ({ userStatus, quest, questChain, refresh }) => (
  <CollapsableText title={quest.name}>
    <Box mt={2} color="white">
      <MarkdownViewer markdown={quest.description ?? ''} />
      {/* upload proof */}
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
                  ? 'Review quest.Pending'
                  : 'Accepted'}
              </Box>
            </Box>
          )
        }
      </Flex>
    </Box>
  </CollapsableText>
);
