import { Button, Flex, Heading } from '@chakra-ui/react';
import { useState } from 'react';

import { QuestsRejected } from '@/components/ProfileView/QuestsRejected';
import { QuestsToReview } from '@/components/ProfileView/QuestsToReview';
import { useWallet } from '@/web3';

import { NFTsToMint } from './NFTsToMint';

enum Tab {
  NFTS = 'nfts',
  SUBMISSIONS = 'submissions',
  REVIEWS = 'reviews',
}

export const UserActionsNeeded: React.FC = () => {
  const { address } = useWallet();
  const [tab, setTab] = useState<Tab>(Tab.NFTS);

  if (!address) return null;

  return (
    <Flex align="stretch" direction="column">
      <Heading w="100%" textAlign="left" mb={6} fontSize={28}>
        Actions needed
      </Heading>
      <Flex mb={6}>
        <Button
          onClick={() => setTab(Tab.NFTS)}
          mr={3}
          variant={tab === Tab.NFTS ? 'outline' : 'ghost'}
          borderRadius="3xl"
        >
          My NFTs
        </Button>
        <Button
          onClick={() => setTab(Tab.SUBMISSIONS)}
          mr={3}
          variant={tab === Tab.SUBMISSIONS ? 'outline' : 'ghost'}
          borderRadius="3xl"
        >
          My submissions
        </Button>
        <Button
          onClick={() => setTab(Tab.REVIEWS)}
          variant={tab === Tab.REVIEWS ? 'outline' : 'ghost'}
          borderRadius="3xl"
        >
          To be reviewed
        </Button>
      </Flex>
      {tab === Tab.NFTS && <NFTsToMint />}
      {tab === Tab.SUBMISSIONS && <QuestsRejected />}
      {tab === Tab.REVIEWS && <QuestsToReview />}
    </Flex>
  );
};
