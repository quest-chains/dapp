import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { Signer } from 'ethers';
import {
  Field,
  FieldArray,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikState,
} from 'formik';
import Head from 'next/head';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { QuestChainTile } from '@/components/QuestChainTile';
import { SubmitButton } from '@/components/SubmitButton';
import { useLatestCreatedQuestChainsData } from '@/hooks/useLatestCreatedQuestChainsData';
import { QuestChainFactory, QuestChainFactory__factory } from '@/types';
import { FACTORY_CONTRACT } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadataViaAPI } from '@/utils/metadata';
import { useWallet } from '@/web3';

interface FormValues {
  name: string;
  editorAddresses: string[];
  reviewerAddresses: string[];
}

const Create: React.FC = () => {
  const initialValues: FormValues = {
    name: '',
    editorAddresses: [],
    reviewerAddresses: [],
  };
  const [description, setDescription] = useState('');

  const { provider } = useWallet();
  const factoryContract: QuestChainFactory = QuestChainFactory__factory.connect(
    FACTORY_CONTRACT,
    provider?.getSigner() as Signer,
  );

  const { questChains, fetching, refresh } = useLatestCreatedQuestChainsData();

  const onSubmit = useCallback(
    async (
      { name, editorAddresses, reviewerAddresses }: FormValues,
      { setSubmitting, resetForm }: FormikHelpers<FormValues>,
    ) => {
      const metadata: Metadata = {
        name,
        description,
        editors: editorAddresses.map(address => ({ id: address })),
        reviewers: reviewerAddresses.map(address => ({ id: address })),
      };
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
        const hash = await uploadMetadataViaAPI(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm the transaction in your Wallet',
        );
        const tx = await factoryContract.create(details);
        toast.dismiss(tid);
        tid = handleTxLoading(tx.hash);
        const receipt = await tx.wait(1);
        toast.dismiss(tid);
        tid = toast.loading(
          'Transaction confirmed. Waiting for The Graph to index the transaction data.',
        );
        await waitUntilBlock(receipt.blockNumber);
        toast.dismiss(tid);
        toast.success('Successfully created a new Quest Chain');
        refresh();
        resetForm();
        setDescription('');
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setSubmitting(false);
    },
    [factoryContract, refresh, description],
  );

  return (
    <VStack w="100%" align="stretch" px={{ base: 0, lg: 40 }} spacing={8}>
      <Head>
        <title>DAOQuest</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting, values }: FormikState<FormValues>) => (
          <Form>
            {/* Left Column: Quest Chain Name, Quest Chain Description, Core Member Addresses */}
            <Flex flexDirection="column">
              <Text mb={6} color="main" fontSize={20}>
                CREATE QUEST CHAIN
              </Text>
              <Flex
                flexDir="column"
                boxShadow="inset 0px 0px 0px 1px #AD90FF"
                p={8}
                borderRadius={30}
              >
                <VStack mb={4} align="flex-start" gap={3}>
                  <Wrap minW="20rem">
                    <Field name="name">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <FormControl isRequired>
                          <FormLabel color="main" htmlFor="name">
                            Quest Chain Name
                          </FormLabel>
                          <Input
                            color="white"
                            {...field}
                            id="name"
                            placeholder="Quest Chain Name"
                          />
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Wrap>
                  <FieldArray
                    name="editorAddresses"
                    render={arrayHelpers => (
                      <Box>
                        <FormLabel color="main" htmlFor="editorAddresses">
                          Editor Addresses
                        </FormLabel>
                        {values.editorAddresses.map((_address, index) => (
                          <HStack key={index} mb={2}>
                            <Field name={`editorAddresses.${index}`}>
                              {({ field }: FieldProps<string, FormValues>) => (
                                <FormControl isRequired>
                                  <Input
                                    {...field}
                                    id={`editorAddresses.${index}`}
                                    placeholder="Editor Address"
                                  />
                                </FormControl>
                              )}
                            </Field>
                            <Button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              -
                            </Button>
                          </HStack>
                        ))}
                        <Button
                          type="button"
                          onClick={() => arrayHelpers.push('')}
                        >
                          Add address
                        </Button>
                      </Box>
                    )}
                  />
                  <FieldArray
                    name="reviewerAddresses"
                    render={arrayHelpers => (
                      <Box>
                        <FormLabel htmlFor="reviewerAddresses" color="main">
                          Reviewer Addresses
                        </FormLabel>
                        {values.reviewerAddresses.map((_address, index) => (
                          <HStack key={index} mb={2}>
                            <Field name={`reviewerAddresses.${index}`}>
                              {({ field }: FieldProps<string, FormValues>) => (
                                <FormControl isRequired>
                                  <Input
                                    {...field}
                                    id={`reviewerAddresses.${index}`}
                                    placeholder="Reviewer Address"
                                  />
                                </FormControl>
                              )}
                            </Field>
                            <Button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              -
                            </Button>
                          </HStack>
                        ))}
                        <Button
                          type="button"
                          onClick={() => arrayHelpers.push('')}
                        >
                          Add address
                        </Button>
                      </Box>
                    )}
                  />
                  <FormControl isRequired>
                    <FormLabel color="main" htmlFor="description">
                      Quest Chain Description
                    </FormLabel>
                    <MarkdownEditor
                      value={description}
                      onChange={setDescription}
                      placeholder="Quest Chain Description"
                    />
                  </FormControl>
                </VStack>
                <Flex w="100%" justify="flex-end">
                  <SubmitButton mt={4} isLoading={isSubmitting} type="submit">
                    Create
                  </SubmitButton>
                </Flex>
              </Flex>
            </Flex>
          </Form>
        )}
      </Formik>
      {fetching ? (
        <VStack w="100%">
          <Spinner color="main" />
        </VStack>
      ) : (
        <>
          {questChains.length > 0 && (
            <Text fontSize={20} textTransform="uppercase" color="white">
              {`Created ${questChains.length} Quest Chain${
                questChains.length > 1 ? 's' : ''
              }`}
            </Text>
          )}
          <VStack w="full" gap={4} flex={1}>
            {questChains.map(({ address, name, description }) => (
              <QuestChainTile
                {...{ address, name, description }}
                key={address}
              />
            ))}
          </VStack>
        </>
      )}
    </VStack>
  );
};

export default Create;
