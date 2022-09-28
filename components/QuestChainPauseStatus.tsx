import { Button } from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

import { PowerIcon } from './icons/PowerIcon';
export const QuestChainPauseStatus: React.FC<{
  questChain: graphql.QuestChainInfoFragment;
  refresh: () => void | Promise<void>;
}> = ({ questChain, refresh }) => {
  const { provider, chainId } = useWallet();
  const [isLoading, setLoading] = useState(false);

  const togglePause = useCallback(async () => {
    if (!chainId || chainId !== questChain.chainId || !provider) {
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
      const contract = getQuestChainContract(
        questChain.address,
        questChain.version,
        provider.getSigner(),
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
  }, [chainId, refresh, questChain, provider]);

  return (
    <Button
      onClick={togglePause}
      isLoading={isLoading}
      variant="ghost"
      fontSize="xs"
      leftIcon={<PowerIcon />}
    >
      {questChain.paused ? 'Enable Quest Chain' : 'Disable Quest Chain'}
    </Button>
  );
};
