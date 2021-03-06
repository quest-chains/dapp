import { Box, Flex } from '@chakra-ui/react';

import { UserStatusType } from '@/pages/chain/[chainId]/[address]';

import { CollapsableText } from './CollapsableText';
import { MarkdownViewer } from './MarkdownViewer';
import { UploadProof } from './UploadProof';

type CollapsableQuestDisplayProps = {
  name?: string | undefined | null;
  description?: string | undefined | null;
  userStatus: UserStatusType;
  questId: string;
  address: string | null | undefined;
  questChainAddress: string;
  chainId: string;
  refresh: () => void;
};

export const CollapsableQuestDisplay: React.FC<
  CollapsableQuestDisplayProps
> = ({
  name,
  description,
  userStatus,
  questId,
  address,
  questChainAddress,
  chainId,
  refresh,
}) => (
  <CollapsableText title={name}>
    <Box mt={2} color="white">
      <MarkdownViewer markdown={description ?? ''} />
      {/* upload proof */}
      <Flex mt={5}>
        {
          // TODO: Also display prev submissions and reviews here
          !userStatus[questId]?.status ||
          userStatus[questId]?.status === 'init' ||
          userStatus[questId]?.status === 'fail' ? (
            <UploadProof
              // TODO: move the modal inside this outside so that we don't render a new Modal for each quest
              address={address}
              questId={questId}
              questChainId={chainId}
              questChainAddress={questChainAddress}
              name={name}
              refresh={refresh}
            />
          ) : (
            <Box>
              <Box
                color={
                  userStatus[questId]?.status === 'review' ? 'pending' : 'main'
                }
                border="1px solid"
                borderColor={
                  userStatus[questId]?.status === 'review' ? 'pending' : 'main'
                }
                bgColor={
                  userStatus[questId]?.status === 'review'
                    ? '#EFFF8F20'
                    : 'main.100'
                }
                px={4}
                borderRadius={6}
                fontSize="sm"
              >
                {userStatus[questId]?.status === 'review'
                  ? 'Review Pending'
                  : 'Accepted'}
              </Box>
            </Box>
          )
        }
      </Flex>
    </Box>
  </CollapsableText>
);
