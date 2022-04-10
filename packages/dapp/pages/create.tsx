/* eslint-disable import/no-unresolved */
import { LinkIcon } from '@chakra-ui/icons';
import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { providers, Signer } from 'ethers';
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikState,
} from 'formik';
import Head from 'next/head';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { SubmitButton } from '@/components/SubmitButton';
import { QuestChainFactory, QuestChainFactory__factory } from '@/types';
import { FACTORY_CONTRACT } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { Metadata, uploadMetadataViaAPI } from '@/utils/metadata';
import { useWallet } from '@/web3';

interface FormValues {
  name: string;
  description: string;
}

const getQuestChainAddress = (
  factoryContract: QuestChainFactory,
  receipt: providers.TransactionReceipt,
): string | null => {
  const abi = factoryContract.interface;
  const eventFragment = abi.getEvent('NewQuestChain');
  const eventTopic = abi.getEventTopic(eventFragment);
  const log = receipt.logs.find(e => e.topics[0] === eventTopic);
  if (log) {
    const decodedLog = abi.decodeEventLog(eventFragment, log.data, log.topics);
    return decodedLog.questChain;
  }
  return null;
};

const Create: React.FC = () => {
  const [questChains, setQuestChains] = useState<
    (Metadata & { address: string })[]
  >([]);
  const initialValues: FormValues = {
    name: '',
    description: '',
  };

  const { provider } = useWallet();
  const factoryContract: QuestChainFactory = QuestChainFactory__factory.connect(
    FACTORY_CONTRACT,
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
        const address = getQuestChainAddress(factoryContract, receipt);
        if (address) {
          setQuestChains(chains => {
            return [...chains, { ...metadata, address }];
          });
        }
      } catch (error) {
        toast.dismiss(tid);
        handleError(error);
      }

      setSubmitting(false);
    },
    [factoryContract],
  );

  return (
    <VStack w="100%" align="stretch" px={40}>
      <Head>
        <title>DAOQuest</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting }: FormikState<FormValues>) => (
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
                <VStack mb={4} align="flex-start">
                  <Wrap minW="20rem">
                    <Field name="name">
                      {({ field, form }: FieldProps<string, FormValues>) => (
                        <FormControl isRequired>
                          <FormLabel color="main" htmlFor="name">
                            Quest Chain Name
                          </FormLabel>
                          <Input
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
                  <Field name="description">
                    {({ field, form }: FieldProps<string, FormValues>) => (
                      <FormControl isRequired>
                        <FormLabel color="main" htmlFor="description">
                          Quest Chain Description
                        </FormLabel>
                        <Input
                          {...field}
                          id="description"
                          placeholder="Quest Chain Description"
                        />
                        <FormErrorMessage>
                          {form.errors.description}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </VStack>
                {/* <FieldArray
                name="coreMemberAddresses"
                render={arrayHelpers => (
                  <Box>
                    <FormLabel color="main" htmlFor="name">
                      Core Member Addresses
                    </FormLabel>
                    {props.values.coreMemberAddresses.map((address, index) => (
                      <HStack key={index} mb={2}>
                        <Field name={`coreMemberAddresses.${index}`}>
                          {({ field }: { field: any }) => (
                            <FormControl isRequired>
                              <Input
                                {...field}
                                id={`coreMemberAddresses.${index}`}
                                placeholder="Core Member Address"
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
                    <Button type="button" onClick={() => arrayHelpers.push('')}>
                      Add address
                    </Button>
                  </Box>
                )}
              /> */}
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
      {questChains.map(({ name, address }, index) => (
        <Wrap key="address">
          <NextLink
            as={`/quest-chain/${address}`}
            href={`/quest-chain/[address]`}
            passHref
          >
            <Link textDecor="underline">
              {index + 1}. {name} <LinkIcon />
            </Link>
          </NextLink>
        </Wrap>
      ))}
    </VStack>
  );
};

export default Create;
