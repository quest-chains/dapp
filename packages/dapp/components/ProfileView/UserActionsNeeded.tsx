import { Button, Flex, Heading, Spinner, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { QuestsRejected } from '@/components/ProfileView/QuestsRejected';
import { QuestsToReview } from '@/components/ProfileView/QuestsToReview';
import { useNFTsToMintForAllChains } from '@/hooks/useNFTsToMintForAllChains';
import { useWallet } from '@/web3';

import { NFTsToMint } from './NFTsToMint';

enum Tab {
  NFTS = 'nfts',
  SUBMISSIONS = 'submissions',
  REVIEWS = 'reviews',
}

export const UserActionsNeeded: React.FC = () => {
  const { address } = useWallet();
  const [tab, setTab] = useState<Tab>(Tab.SUBMISSIONS);

  const {
    results: nftsToMint,
    fetching,
    refresh,
  } = useNFTsToMintForAllChains(address ?? '');

  useEffect(() => {
    if (fetching) return;
    if (nftsToMint.length === 0) {
      setTab(Tab.SUBMISSIONS);
    } else if (nftsToMint.length > 0) {
      setTab(Tab.NFTS);
    }
  }, [nftsToMint, fetching]);

  if (!address) return null;

  return (
    <Flex align="stretch" direction="column">
      <Heading w="100%" textAlign="left" mb={6} fontSize={28}>
        Actions needed
      </Heading>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          <Flex mb={6}>
            {nftsToMint.length > 0 && (
              <Button
                onClick={() => setTab(Tab.NFTS)}
                mr={3}
                variant={tab === Tab.NFTS ? 'outline' : 'ghost'}
                borderRadius="3xl"
              >
                My NFTs
              </Button>
            )}
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
          {tab === Tab.NFTS && (
            <NFTsToMint nftsToMint={nftsToMint} refresh={refresh} />
          )}
          {tab === Tab.SUBMISSIONS && <QuestsRejected address={address} />}
          {tab === Tab.REVIEWS && <QuestsToReview address={address} />}
        </>
      )}
    </Flex>
  );
};
