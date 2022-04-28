import { Box } from '@chakra-ui/react';

import { CollapsableText } from './CollapsableText';
import { MarkdownViewer } from './MarkdownViewer';

type CollapsableQuestDisplayProps = {
  name?: string | undefined | null;
  description?: string | undefined | null;
};

export const CollapsableQuestDisplay: React.FC<
  CollapsableQuestDisplayProps
> = ({ name, description }) => (
  <Box>
    <CollapsableText title={name}>
      <Box mx={4} mt={2} color="white">
        <MarkdownViewer markdown={description ?? ''} />
      </Box>
    </CollapsableText>
  </Box>
);
