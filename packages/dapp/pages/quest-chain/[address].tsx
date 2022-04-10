/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { AddQuestBlock } from '@/components/AddQuestBlock';
import { SubmitButton } from '@/components/SubmitButton';
import {
  getQuestChainAddresses,
  getQuestChainInfo,
} from '@/graphql/questChains';
import { useLatestQuestChainData } from '@/hooks/useLatestQuestChainData';
import { useWallet } from '@/web3';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const QuestChain: React.FC<Props> = ({ questChain: inputQuestChain }) => {
  const { isFallback } = useRouter();
  const { address } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [proofDescription, setProofDescription] = useState('');

  const handleInputChange = (e: any) => setProofDescription(e.target.value);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  const submit = () => {
    console.log(proofDescription);
    console.log(acceptedFiles);
  };

  const { questChain, refresh } = useLatestQuestChainData(inputQuestChain);
  if (isFallback) {
    return (
      <VStack>
        <Spinner color="main" />
      </VStack>
    );
  }
  if (!questChain) {
    return (
      <VStack>
        <Text> Quest Chain not found! </Text>
      </VStack>
    );
  }
  const isAdmin: boolean = questChain.admins.some(
    ({ address: a }) => a === address?.toLowerCase(),
  );
  const isEditor: boolean = questChain.editors.some(
    ({ address: a }) => a === address?.toLowerCase(),
  );
  const isReviewer: boolean = questChain.editors.some(
    ({ address: a }) => a === address?.toLowerCase(),
  );

  const isUser = !(isAdmin || isEditor || isReviewer);

  return (
    <VStack w="100%" align="flex-start" color="main" px={isUser ? 40 : 0}>
      <Head>
        <title>{questChain.name}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Text fontSize="2xl" fontWeight="bold">
        {questChain.name}
      </Text>
      <Text fontWeight="lg">{questChain.description}</Text>
      <SimpleGrid columns={isUser ? 1 : 2} spacing={16} pt={8} w="100%">
        <VStack spacing={6}>
          <Text w="100%" color="main" fontSize={20} textTransform="uppercase">
            {questChain.quests.length} Quests found
          </Text>
          {questChain.quests.map(quest => (
            <VStack
              w="100%"
              boxShadow="inset 0px 0px 0px 1px #AD90FF"
              p={8}
              gap={3}
              borderRadius={20}
              align="stretch"
              key={quest.questId}
            >
              <Text fontSize="lg">{quest.name}</Text>
              <Text color="white">{quest.description}</Text>

              <Box>
                <Button onClick={onOpen}>Upload Proof</Button>
              </Box>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Upload Proof</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl isRequired>
                      <FormLabel color="main" htmlFor="proofDescription">
                        Description
                      </FormLabel>
                      <Textarea
                        id="proofDescription"
                        value={proofDescription}
                        onChange={handleInputChange}
                        mb={4}
                      />
                    </FormControl>
                    <FormLabel color="main" htmlFor="file">
                      Upload file
                    </FormLabel>
                    <Flex
                      {...getRootProps({ className: 'dropzone' })}
                      flexDir="column"
                      borderWidth={1}
                      borderStyle="dashed"
                      borderRadius={20}
                      p={4}
                      mb={4}
                    >
                      <input {...getInputProps()} />
                      <Box mb={4}>Drag 'n' drop some files here</Box>
                      <Box>
                        <Button
                          type="button"
                          onClick={open}
                          borderRadius="full"
                        >
                          Open File Dialog
                        </Button>
                      </Box>
                    </Flex>
                    <Text>Files:</Text>
                    {acceptedFiles.map((file: any) => (
                      <li key={file.path}>
                        {file.path} - {file.size} bytes
                      </li>
                    ))}
                  </ModalBody>

                  <ModalFooter alignItems="baseline">
                    <Button variant="ghost" mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <SubmitButton
                      mt={4}
                      type="submit"
                      onClick={submit}
                      isDisabled={!acceptedFiles.length || !proofDescription}
                    >
                      Submit
                    </SubmitButton>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </VStack>
          ))}
        </VStack>
        <VStack spacing={8}>
          <AddQuestBlock questChain={questChain} refresh={refresh} />
        </VStack>
      </SimpleGrid>
    </VStack>
  );
};

type QueryParams = { address: string };

export async function getStaticPaths() {
  const addresses = await getQuestChainAddresses(1000);
  const paths = addresses.map(address => ({
    params: { address },
  }));

  return { paths, fallback: true };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const address = context.params?.address;

  const questChain = address ? await getQuestChainInfo(address) : null;

  return {
    props: {
      questChain,
    },
    revalidate: 1,
  };
};

export default QuestChain;
