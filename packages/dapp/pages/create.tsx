import { LinkIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
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
import { Field, Form, Formik } from 'formik';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { Metadata } from '@/../utils/dist';
import { QuestChainFactory, QuestChainFactory__factory } from '@/types';
import { FACTORY_CONTRACT } from '@/utils/constants';
import { waitUntilBlock } from '@/utils/graphHelpers';
import { handleError, handleTxLoading } from '@/utils/helpers';
import { uploadMetadata } from '@/utils/metadata';
import { useWallet } from '@/web3';

interface QuestChainCreationFormValues {
  name: string;
  description: string;
  // coreMemberAddresses: string[];
}

const getQuestChainAddress = (
  factory: QuestChainFactory,
  receipt: providers.TransactionReceipt,
): string | null => {
  const abi = factory.interface;
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
  const initialValues: QuestChainCreationFormValues = {
    name: '',
    description: '',
    // coreMemberAddresses: [],
  };

  const { provider } = useWallet();
  const factory: QuestChainFactory = QuestChainFactory__factory.connect(
    FACTORY_CONTRACT,
    provider?.getSigner() as Signer,
  );

  const onSubmit = useCallback(
    async (
      { name, description }: QuestChainCreationFormValues,
      { setSubmitting }: { setSubmitting: (b: boolean) => void },
    ) => {
      const metadata: Metadata = {
        name,
        description,
      };
      let tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      try {
        const hash = await uploadMetadata(metadata);
        const details = `ipfs://${hash}`;
        toast.dismiss(tid);
        tid = toast.loading(
          'Waiting for Confirmation - Confirm this transaction in your Wallet',
        );
        const tx = await factory.create(details);
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
        const address = getQuestChainAddress(factory, receipt);
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
    [factory],
  );

  return (
    <VStack w="100%" align="stretch">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {props => (
          <Form>
            {/* Left Column: Quest Chain Name, Quest Chain Description, Core Member Addresses */}
            <Flex flexDirection="column">
              <Text mb={6} color="main" fontSize={20}>
                QUEST CHAIN INFO
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
                      {({ field, form }: { field: any; form: any }) => (
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
                    {({ field, form }: { field: any; form: any }) => (
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
              </Flex>
              <Box>
                <Button
                  mt={4}
                  colorScheme="teal"
                  isLoading={props.isSubmitting}
                  type="submit"
                  float="right"
                >
                  Create Quest Chain
                </Button>
              </Box>
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
