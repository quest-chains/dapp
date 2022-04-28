/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { Framework } from '@superfluid-finance/sdk-core';
import { Signer } from 'ethers';
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikState,
} from 'formik';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { QuestChainInfoFragment } from '@/graphql/types';
import { QuestChain, QuestChain__factory } from '@/types';
import { DAIx, DAOQUEST_ADDRESS } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadataViaAPI } from '@/utils/metadata';
import { useWallet } from '@/web3';

import { CreateFlow } from './CreateFlow';
import { MarkdownEditor } from './MarkdownEditor';
import { SubmitButton } from './SubmitButton';

interface FormValues {
  name: string;
}

// TODO test superfuild for all supported networks and then enable in production
const ENABLE_SUPERFLUID = false;

export const AddQuestBlock: React.FC<{
  questChain: QuestChainInfoFragment;
  refresh: () => void;
  onClose: () => void;
}> = ({ questChain, refresh, onClose }) => {
  const { isOpen, onOpen, onClose: onClosePaymentPlan } = useDisclosure();
  const { address, provider, chainId } = useWallet();
  const isEditor: boolean = questChain.editors.some(
    ({ address: a }) => a === address?.toLowerCase(),
  );
  const initialValues: FormValues = {
    name: '',
  };

  const contract: QuestChain = QuestChain__factory.connect(
    questChain.address,
    provider?.getSigner() as Signer,
  );

  const [description, setDescription] = useState('');
  const onSubmit = useCallback(
    async (
      { name }: FormValues,
      { setSubmitting, resetForm }: FormikHelpers<FormValues>,
    ) => {
      if (!chainId || questChain.chainId !== chainId) return;

      // close the dialog
      onClose();
      if (questChain.quests.length > 4 && ENABLE_SUPERFLUID) {
        const signer = provider?.getSigner();

        const sf = await Framework.create({
          chainId: Number(chainId),
          provider: provider,
        });

        if (signer) {
          const { flowRate } = await sf.cfaV1.getFlow({
            superToken: DAIx,
            sender: questChain.admins[0].address,
            receiver: DAOQUEST_ADDRESS,
            providerOrSigner: signer,
          });

          if (Number(flowRate) > 190001234567901) {
            console.log('has premium subscription');
          } else if (Number(flowRate) > 190001234567901 / 2) {
            if (questChain.quests.length > 19) {
              onOpen();
            } else {
              console.log('has basic subscription');
            }
          } else {
            onOpen();
            return;
          }
        }
      }

      // if the user is trying to create more than 5 quests
      // and if the user has not purchased the subscription

      const metadata: Metadata = {
        name,
        description,
      };
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');

      try {
        const hash = await uploadMetadataViaAPI(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm the transaction in your Wallet',
        );
        const tx = await contract.createQuest(details);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(chainId, receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully added a new Quest');
        refresh();
        resetForm();
        setDescription('');
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setSubmitting(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contract, refresh, onOpen, questChain, description, chainId],
  );

  if (!isEditor) return null;

  return (
    <Flex w="100%" direction="column" align="stretch">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting }: FormikState<FormValues>) => (
          <Form>
            <Flex w="full" gap={20} alignItems="normal">
              <Flex flexGrow={1} flexDirection="column">
                <VStack mb={4} spacing={4}>
                  <Field name="name">
                    {({ field, form }: FieldProps<string, FormValues>) => (
                      <FormControl isRequired>
                        <FormLabel color="main" htmlFor="name">
                          Quest Name
                        </FormLabel>
                        <Input
                          color="white"
                          {...field}
                          id="name"
                          placeholder="Quest Name"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <FormControl isRequired>
                    <FormLabel color="main" htmlFor="description">
                      Quest Description
                    </FormLabel>
                    <MarkdownEditor
                      value={description}
                      placeholder="Quest Description"
                      onChange={setDescription}
                    />
                  </FormControl>
                </VStack>
                <Flex w="100%" justify="flex-end" mb={4}>
                  <SubmitButton
                    mt={4}
                    isLoading={isSubmitting}
                    isDisabled={chainId !== questChain.chainId}
                    type="submit"
                  >
                    Add
                  </SubmitButton>
                </Flex>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>

      <Modal isOpen={isOpen} onClose={onClosePaymentPlan}>
        <ModalOverlay />
        <ModalContent maxW="36rem">
          <ModalHeader>Payment plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateFlow ownerAddress={questChain.admins[0].address} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
