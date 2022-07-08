import { Button, Image } from '@chakra-ui/react';
import { Signer } from 'ethers';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import Power from '@/assets/Power.svg';
import { QuestChainInfoFragment } from '@/graphql/types';
import { QuestChain, QuestChain__factory } from '@/types';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';

export const QuestChainPauseStatus: React.FC<{
  questChain: QuestChainInfoFragment;
  refresh: () => void | Promise<void>;
}> = ({ questChain, refresh }) => {
  const { provider, chainId } = useWallet();
  const contract: QuestChain = QuestChain__factory.connect(
    questChain.address,
    provider?.getSigner() as Signer,
  );
  const [isLoading, setLoading] = useState(false);

  const togglePause = useCallback(async () => {
    if (!chainId || chainId !== questChain?.chainId) {
      toast.error(
        `Incorrect Network. Please switch your wallet to ${
          AVAILABLE_NETWORK_INFO[questChain.chainId].name
        }`,
      );
      return;
    }
    let tid;
    try {
      setLoading(true);
      tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      const tx = await (questChain.paused
        ? contract.unpause()
        : contract.pause());
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, chainId);
      const receipt = await tx.wait(1);
      toast.dismiss(tid);
      tid = toast.loading(
        'Transaction confirmed. Waiting for The Graph to index the transaction data.',
      );
      await waitUntilBlock(chainId, receipt.blockNumber);
      toast.dismiss(tid);
      toast.success(
        `Successfully ${
          questChain.paused ? 'enabled' : 'disabled'
        } the Quest Chain`,
      );
      refresh();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [contract, chainId, refresh, questChain.paused, questChain.chainId]);

  return (
    <Button
      onClick={togglePause}
      isLoading={isLoading}
      variant="ghost"
      fontSize="xs"
    >
      <Image
        src={Power.src}
        alt={questChain.paused ? 'Enable' : 'Disable'}
        mr={2}
      />
      {questChain.paused ? 'Enable Quest Chain' : 'Disable Quest Chain'}
    </Button>
  );
};
