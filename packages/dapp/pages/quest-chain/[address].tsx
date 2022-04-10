/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
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
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { AddQuestBlock } from '@/components/AddQuestBlock';
import { CollapsableText } from '@/components/CollapsableText';
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
  const [quest, setQuest] = useState<{
    questId: string;
    name: string | null | undefined;
    description: string | null | undefined;
  } | null>(null);
  const [proofDescription, setProofDescription] = useState('');
  const [myFiles, setMyFiles] = useState<any[] | []>([]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: 'image/*,audio/*,video/*',
    onDrop,
  });

  const removeFile = (file: any) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const resetFiles = () => {
    setMyFiles([]);
  };

  const onModalClose = useCallback(() => {
    setProofDescription('');
    setQuest(null);
    onClose();
  }, [onClose]);

  const submit = useCallback(async () => {
    if (quest && proofDescription && myFiles.length > 0) {
      console.log('proofDescription', proofDescription);
      console.log(myFiles);
    }
  }, [proofDescription, myFiles, quest]);

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
          <Text w="100%" color="white" fontSize={20} textTransform="uppercase">
            {questChain.quests.length} Quests found
          </Text>
          {questChain.quests.map(quest => (
            <Flex
              w="100%"
              boxShadow="inset 0px 0px 0px 1px #AD90FF"
              p={8}
              gap={3}
              borderRadius={20}
              align="stretch"
              key={quest.questId}
              justifyContent="space-between"
            >
              <Flex flexDirection="column">
                <CollapsableText title={quest.name}>
                  <Text mx={4} mt={2} color="white" fontStyle="italic">
                    {quest.description}
                  </Text>
                </CollapsableText>
              </Flex>

              {isUser && (
                <Box>
                  <Button
                    onClick={() => {
                      setQuest({
                        questId: quest.questId,
                        name: quest.name,
                        description: quest.description,
                      });
                      resetFiles();
                      onOpen();
                    }}
                  >
                    Upload Proof
                  </Button>
                </Box>
              )}

              <Modal
                isOpen={!!quest && isOpen}
                onClose={onModalClose}
                size="xl"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Upload Proof - {quest?.name}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <FormControl isRequired>
                      <FormLabel color="main" htmlFor="proofDescription">
                        Description
                      </FormLabel>
                      <Textarea
                        id="proofDescription"
                        value={proofDescription}
                        onChange={e => setProofDescription(e.target.value)}
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
                      p={10}
                      mb={4}
                      onClick={open}
                    >
                      <input {...getInputProps()} color="white" />
                      <Box alignSelf="center">
                        Drag 'n' drop some files here
                      </Box>
                    </Flex>
                    <Text>Files:</Text>
                    {myFiles.map((file: any) => (
                      <Flex key={file.path}>
                        <Text mr={4} alignSelf="center">
                          {file.path} - {file.size} bytes
                        </Text>
                        <IconButton
                          borderRadius="full"
                          onClick={removeFile(file)}
                          icon={<CloseIcon />}
                          aria-label={''}
                        />
                      </Flex>
                    ))}
                  </ModalBody>

                  <ModalFooter alignItems="baseline">
                    <Button variant="ghost" mr={3} onClick={onModalClose}>
                      Close
                    </Button>
                    <SubmitButton
                      mt={4}
                      type="submit"
                      onClick={submit}
                      isDisabled={!myFiles.length || !proofDescription}
                    >
                      Submit
                    </SubmitButton>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
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

  let questChain = null;
  try {
    questChain = address ? await getQuestChainInfo(address) : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Could not fetch Quest Chain for address ${address}`, error);
  }

  return {
    props: {
      questChain,
    },
    revalidate: 1,
  };
};

export default QuestChain;
