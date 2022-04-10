/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
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
import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { QuestChainInfoFragment } from '@/graphql/types';
import { QuestChain, QuestChain__factory } from '@/types';
import { DAIx, DAOQUEST_ADDRESS } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadataViaAPI } from '@/utils/metadata';
import { useWallet } from '@/web3';

import { CreateFlow } from './CreateFlow';
import { SubmitButton } from './SubmitButton';

interface FormValues {
  name: string;
  description: string;
}

export const AddQuestBlock: React.FC<{
  questChain: QuestChainInfoFragment;
  refresh: () => void;
}> = ({ questChain, refresh }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, provider } = useWallet();
  const isEditor: boolean = questChain.editors.some(
    ({ address: a }) => a === address?.toLowerCase(),
  );
  const initialValues: FormValues = {
    name: '',
    description: '',
  };

  const contract: QuestChain = QuestChain__factory.connect(
    questChain.address,
    provider?.getSigner() as Signer,
  );

  const onSubmit = useCallback(
    async (
      { name, description }: FormValues,
      { setSubmitting }: FormikHelpers<FormValues>,
    ) => {
      if (questChain.quests.length > 4) {
        const signer = provider?.getSigner();

        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
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
        await waitUntilBlock(receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully added a new Quest');
        refresh();
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setSubmitting(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [contract, refresh, onOpen, questChain],
  );

  if (!isEditor) return null;

  return (
    <Flex w="100%" direction="column" align="stretch">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting }: FormikState<FormValues>) => (
          <Form>
            <Flex w="full" gap={20} alignItems="normal">
              <Flex flexGrow={1} flexDirection="column">
                <Text
                  mb={6}
                  color="main"
                  fontSize={20}
                  textTransform="uppercase"
                >
                  Add Quest
                </Text>
                <Flex
                  flexDir="column"
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  p={8}
                  borderRadius={30}
                >
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
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="description">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <FormControl isRequired>
                          <FormLabel color="main" htmlFor="description">
                            Quest Description
                          </FormLabel>
                          <Input
                            color="white"
                            {...field}
                            id="description"
                            placeholder="Quest Description"
                          />
                          <FormErrorMessage>
                            {form.errors.description}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                  <Flex w="100%" justify="flex-end">
                    <SubmitButton mt={4} isLoading={isSubmitting} type="submit">
                      Add
                    </SubmitButton>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="36rem">
          <ModalHeader>Payment plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateFlow ownerAddress={questChain.admins[0].address} />
          </ModalBody>

          <ModalFooter alignItems="baseline">
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
