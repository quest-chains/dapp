import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import VictoryCupImage from '@/assets/victory-cup.svg';
import { QuestChainInfoFragment } from '@/graphql/types';
import { QuestChain as QuestChainV0 } from '@/types/v0';
import { QuestChain as QuestChainV1 } from '@/types/v1';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

type QuestChainTileProps = {
  questChain: QuestChainInfoFragment;
  completed: number;
  onSuccess?: () => void;
};

export const MintNFTTile: React.FC<QuestChainTileProps> = ({
  questChain,
  completed,
  onSuccess,
}) => {
  const { provider, chainId, address } = useWallet();

  const [isMinting, setMinting] = useState(false);
  const onMint = useCallback(async () => {
    if (!chainId || questChain.chainId !== chainId || !address || !provider)
      return;
    setMinting(true);
    let tid = toast.loading(
      'Waiting for Confirmation - Confirm the transaction in your Wallet',
    );
    try {
      const contract = getQuestChainContract(
        questChain.address,
        questChain.version,
        provider.getSigner(),
      );

      const tx = await (questChain.version === '1'
        ? (contract as QuestChainV1).mintToken()
        : (contract as QuestChainV0).mintToken(address));
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, questChain.chainId);
      const receipt = await tx.wait(1);
      toast.dismiss(tid);
      tid = toast.loading(
        'Transaction confirmed. Waiting for The Graph to index the transaction data.',
      );
      await waitUntilBlock(questChain.chainId, receipt.blockNumber);
      toast.dismiss(tid);
      toast.success(`Successfully minted your NFT`);
      onSuccess?.();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setMinting(false);
    }
  }, [onSuccess, questChain, address, chainId, provider]);

  return (
    <VStack
      w="100%"
      p={8}
      borderRadius="1rem"
      bg="rgba(255,255,255, 0.1)"
      color="white"
      textAlign="center"
      spacing={4}
    >
      <Image src={VictoryCupImage.src} alt="Success" />
      <Text>
        {`You have successfully finished ${
          completed > 1 ? `all ${completed} quests` : 'all quests'
        } from ${questChain.name ?? 'this quest chain'}.`}
      </Text>
      <Button
        w="100%"
        isLoading={isMinting}
        onClick={onMint}
        borderRadius="full"
        _hover={{
          bg: 'main.100',
        }}
        bg="main"
        color="black"
      >
        MINT YOUR NFT
      </Button>
    </VStack>
  );
};
