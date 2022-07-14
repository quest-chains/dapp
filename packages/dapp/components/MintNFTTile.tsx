import { Button, Image, Text, VStack } from '@chakra-ui/react';
import { Signer } from 'ethers';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import VictoryCupImage from '@/assets/victory-cup.svg';
import { QuestChain, QuestChain__factory } from '@/types/v0';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { useWallet } from '@/web3';

type QuestChainTileProps = {
  address: string;
  chainId: string;
  name?: string | null | undefined;
  completed: number;
  onSuccess?: () => void;
};

export const MintNFTTile: React.FC<QuestChainTileProps> = ({
  address,
  name,
  chainId,
  completed,
  onSuccess,
}) => {
  const { provider, chainId: userChainId, address: userAddress } = useWallet();

  const contract: QuestChain = QuestChain__factory.connect(
    address,
    provider?.getSigner() as Signer,
  );

  const [isMinting, setMinting] = useState(false);
  const onMint = useCallback(async () => {
    if (!userChainId || chainId !== userChainId || !userAddress) return;
    setMinting(true);
    let tid = toast.loading(
      'Waiting for Confirmation - Confirm the transaction in your Wallet',
    );
    try {
      const tx = await contract.mintToken(userAddress);
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, chainId);
      const receipt = await tx.wait(1);
      toast.dismiss(tid);
      tid = toast.loading(
        'Transaction confirmed. Waiting for The Graph to index the transaction data.',
      );
      await waitUntilBlock(chainId, receipt.blockNumber);
      toast.dismiss(tid);
      toast.success(`Successfully minted your NFT`);
      onSuccess?.();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setMinting(false);
    }
  }, [contract, onSuccess, chainId, userAddress, userChainId]);

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
        } from ${name ?? 'this quest chain'}.`}
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
