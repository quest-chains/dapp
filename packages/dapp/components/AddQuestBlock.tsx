import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
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
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadataViaAPI } from '@/utils/metadata';
import { useWallet } from '@/web3';

import { SubmitButton } from './SubmitButton';

interface FormValues {
  name: string;
  description: string;
}

export const AddQuestBlock: React.FC<{
  questChain: QuestChainInfoFragment;
  refresh: () => void;
}> = ({ questChain, refresh }) => {
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
    [contract, refresh],
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
    </Flex>
  );
};
