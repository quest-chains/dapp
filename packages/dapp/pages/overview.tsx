import { SimpleGrid } from '@chakra-ui/react';
import Head from 'next/head';

import { QuestsToReview } from '@/components/QuestsToReview';
import { UserProgress } from '@/components/UserProgress';

const Overview: React.FC = () => {
  return (
    <SimpleGrid columns={2} spacing={8}>
      <Head>
        <title>Overview</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* left */}
      <UserProgress />

      {/* right */}
      <QuestsToReview />
    </SimpleGrid>
  );
};

export default Overview;
