import { Heading } from '@chakra-ui/react';

import { Page } from '@/components/Layout/Page';
import { HeadComponent } from '@/components/Seo';
import { IPFSGatewaySettings } from '@/components/Settings/IPFSGatewaySettings';
import { QUESTCHAINS_URL } from '@/utils/constants';

const Settings: React.FC = () => {
  return (
    <Page align="start" gap={4}>
      <HeadComponent
        title="Quest Chains Settings"
        description="Quest Chains Settings"
        url={QUESTCHAINS_URL + '/settings'}
      />
      <Heading>Settings</Heading>
      <IPFSGatewaySettings />
    </Page>
  );
};

export default Settings;
