import { Box, Button } from '@chakra-ui/react';

import { CollapsableText } from './CollapsableText';
import { MarkdownViewer } from './MarkdownViewer';
import { UploadProof } from './UploadProof';

type CollapsableQuestDisplayProps = {
  name?: string | undefined | null;
  description?: string | undefined | null;
  userStatus: any;
  questId: string;
  mode: string;
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
  mode,
  address,
  questChainAddress,
  chainId,
  refresh,
}) => (
  <Box>
    <CollapsableText title={name}>
      <Box mt={2} color="white">
        <MarkdownViewer markdown={description ?? ''} />
        {/* upload proof */}x§
        {mode === 'QUESTER' && (
          <>
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
                  <Button
                    pointerEvents="none"
                    _hover={{}}
                    cursor="default"
                    color={
                      userStatus[questId]?.status === 'review'
                        ? 'pending'
                        : 'main'
                    }
                    border="1px solid"
                    borderColor={
                      userStatus[questId]?.status === 'review'
                        ? 'pending'
                        : 'main'
                    }
                  >
                    {userStatus[questId]?.status === 'review'
                      ? 'Review Pending'
                      : 'Accepted'}
                  </Button>
                </Box>
              )
            }
          </>
        )}
      </Box>
    </CollapsableText>
  </Box>
);
