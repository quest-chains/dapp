import Head from 'next/head';

import { Page } from '@/components/Layout/Page';
import SearchQuestChains from '@/components/SearchQuestChains';

const Explore: React.FC = () => {
  return (
    <Page alignItems="flex-start" gap={4}>
      <Head>
        <title>Quest Chains</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SearchQuestChains />
    </Page>
  );
};

export default Explore;
