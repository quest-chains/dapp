import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  // Modal,
  // ModalBody,
  // ModalCloseButton,
  // ModalContent,
  // ModalHeader,
  // ModalOverlay,
  // useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { contracts, graphql } from '@quest-chains/sdk';
// import { Framework } from '@superfluid-finance/sdk-core';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useInputText } from '@/hooks/useInputText';
// import { DAIx, DAOQUEST_ADDRESS } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadata } from '@/utils/metadata';
import { AVAILABLE_NETWORK_INFO, useWallet } from '@/web3';
import { getQuestChainContract } from '@/web3/contract';

// import { CreateFlow } from './CreateFlow';

// TODO test superfuild for all supported networks and then enable in production
// const ENABLE_SUPERFLUID = false;

export const AddQuestBlock: React.FC<{
  questChain: graphql.QuestChainInfoFragment;
  refresh: () => void;
  onClose: () => void;
}> = ({ questChain, refresh, onClose }) => {
  // const { isOpen, onOpen, onClose: onClosePaymentPlan } = useDisclosure();
  const { address, provider, chainId } = useWallet();
  const isEditor: boolean = questChain.editors.some(
    ({ address: a }) => a === address?.toLowerCase(),
  );
  const [isSubmitting, setSubmitting] = useState(false);

  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();
  const onSubmit = useCallback(async () => {
    if (!chainId || !provider || questChain.chainId !== chainId) {
      toast.error(
        `Wrong Chain, please switch to ${
          AVAILABLE_NETWORK_INFO[questChain.chainId].label
        }`,
      );
      return;
    }

    setSubmitting(true);

    ///////////////////////////////////////////////////////////
    // if (questChain.quests.length > 4 && ENABLE_SUPERFLUID) {
    //   const signer = provider.getSigner();

    //   const sf = await Framework.create({
    //     chainId: Number(chainId),
    //     provider: provider,
    //   });

    //   if (signer) {
    //     const { flowRate } = await sf.cfaV1.getFlow({
    //       superToken: DAIx,
    //       sender: questChain.admins[0].address,
    //       receiver: DAOQUEST_ADDRESS,
    //       providerOrSigner: signer,
    //     });

    //     if (Number(flowRate) > 190001234567901) {
    //       console.log('has premium subscription');
    //     } else if (Number(flowRate) > 190001234567901 / 2) {
    //       if (questChain.quests.length > 19) {
    //         onOpen();
    //       } else {
    //         console.log('has basic subscription');
    //       }
    //     } else {
    //       onOpen();
    //       return;
    //     }
    //   }
    // }
    // if the user is trying to create more than 5 quests
    // and if the user has not purchased the subscription
    ///////////////////////////////////////////////////////////

    const metadata: Metadata = {
      name: nameRef.current,
      description: descRef.current,
    };
    let tid = toast.loading('Uploading metadata to IPFS via web3.storage');

    try {
      const hash = await uploadMetadata(metadata);
      const details = `ipfs://${hash}`;
      toast.dismiss(tid);
      tid = toast.loading(
        'Waiting for Confirmation - Confirm the transaction in your Wallet',
      );
      const contract = getQuestChainContract(
        questChain.address,
        questChain.version,
        provider.getSigner(),
      );

      const tx = await (questChain.version === '1'
        ? (contract as contracts.V1.QuestChain).createQuests([details])
        : (contract as contracts.V0.QuestChain).createQuest(details));
      toast.dismiss(tid);
      tid = handleTxLoading(tx.hash, chainId);
      const receipt = await tx.wait(1);
      toast.dismiss(tid);
      tid = toast.loading(
        'Transaction confirmed. Waiting for The Graph to index the transaction data.',
      );
      await waitUntilBlock(chainId, receipt.blockNumber);
      toast.dismiss(tid);
      toast.success('Successfully added a new Quest');
      setName('');
      setDescription('');
      refresh();
      onClose();
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }, [
    refresh,
    // onOpen,
    questChain,
    nameRef,
    descRef,
    chainId,
    onClose,
    provider,
    setName,
    setDescription,
  ]);

  if (!isEditor) return null;

  return (
    <Flex w="100%" direction="column" align="stretch">
      <form>
        <Flex flexGrow={1} flexDirection="column" gap={4} mb={4}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel htmlFor="name">Quest Name</FormLabel>
              <Input
                color="white"
                defaultValue={nameRef.current}
                bg="#0F172A"
                id="name"
                maxLength={60}
                onChange={e => setName(e.target.value)}
                placeholder="Quest Name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="description">Quest Description</FormLabel>
              <MarkdownEditor
                height="12rem"
                value={descRef.current}
                placeholder="Quest Description"
                onChange={setDescription}
              />
            </FormControl>
          </VStack>
          <Flex w="100%" justify="flex-end">
            <SubmitButton
              onClick={() => {
                if (!nameRef.current || !descRef.current) {
                  toast.error(
                    'To continue, enter the name and description for the quest',
                  );
                  return;
                }
                onSubmit();
              }}
              w="full"
              fontWeight="bold"
              isLoading={isSubmitting}
              fontSize={{ base: 12, md: 14 }}
            >
              ADD QUEST
            </SubmitButton>
          </Flex>
        </Flex>
      </form>

      {/* <Modal isOpen={isOpen} onClose={onClosePaymentPlan}>
        <ModalOverlay />
        <ModalContent maxW="36rem">
          <ModalHeader>Payment plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateFlow ownerAddress={questChain.admins[0].address} />
          </ModalBody>
        </ModalContent>
      </Modal> */}
    </Flex>
  );
};
