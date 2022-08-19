import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { isSupportedNetwork, useWallet } from '@/web3';

export const ChainMetadataForm: React.FC<{
  onBack?: () => void;
  onSubmit: (name: string, metadataUri: string) => void | Promise<void>;
}> = ({ onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
    },
  });

  const removeFile = (file: File) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const { isConnected, chainId } = useWallet();

  const isDisabled =
    !isConnected || !isSupportedNetwork(chainId) || !description;

  const [isSubmitting, setSubmitting] = useState(false);

  const exportMetadata = useCallback(async () => {
    let tid;
    try {
      setSubmitting(true);
      const metadata: Metadata = {
        name,
        description,
      };
      if (myFiles.length) {
        tid = toast.loading('Uploading image to IPFS via web3.storage');
        const file = myFiles[0];
        const imageHash = await uploadFiles([file]);
        metadata.image_url = `ipfs://${imageHash}`;
        toast.dismiss(tid);
      }
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      const hash = await uploadMetadata(metadata);
      const metadataUri = `ipfs://${hash}`;
      toast.dismiss(tid);

      await onSubmit(name, metadataUri);
    } catch (error) {
      if (tid) {
        toast.dismiss(tid);
      }
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }, [name, description, onSubmit, myFiles]);

  return (
    <VStack w="100%" align="stretch" spacing={8}>
      <HStack justify="space-between" w="100%">
        <Text color="main" fontSize={20}>
          QUEST CHAIN METADATA
        </Text>
      </HStack>
      <form>
        <VStack w="100%" align="flex-start" spacing={4}>
          <Wrap minW="20rem">
            <FormControl isRequired>
              <FormLabel color="main" htmlFor="name">
                Name
              </FormLabel>
              <Input
                color="white"
                onChange={e => setName(e.target.value)}
                value={name}
                id="name"
                placeholder="Quest Chain Name"
              />
            </FormControl>
          </Wrap>
          <FormControl isRequired>
            <FormLabel color="main" htmlFor="description">
              Description
            </FormLabel>
            <MarkdownEditor
              value={description}
              onChange={setDescription}
              placeholder="Quest Chain Description"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="main" htmlFor="file">
              Cover Image (optional)
            </FormLabel>
            {myFiles.length ? (
              <>
                {myFiles.map((file: File) => (
                  <Flex key={file.name} pos="relative">
                    {typeof window !== 'undefined' && (
                      <Image
                        alt=""
                        src={window.URL.createObjectURL(file)}
                        height="16rem"
                      />
                    )}
                    <IconButton
                      pos="absolute"
                      size="sm"
                      top={2}
                      left={2}
                      borderRadius="full"
                      onClick={removeFile(file)}
                      icon={<SmallCloseIcon boxSize="1.5rem" />}
                      aria-label={''}
                      backdropFilter="blur(40px)"
                      boxShadow="inset 0px 0px 0px 1px #AD90FF"
                    />
                  </Flex>
                ))}
              </>
            ) : (
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
                <Box alignSelf="center">{`Drag 'n' drop an image here`}</Box>
              </Flex>
            )}
          </FormControl>
          <Flex
            mt={4}
            w="100%"
            justify={onBack ? 'space-between' : 'flex-end'}
            align="center"
          >
            {onBack && (
              <Button
                variant="ghost"
                mr={3}
                onClick={onBack}
                borderRadius="full"
                boxShadow="inset 0px 0px 0px 1px #AD90FF"
              >
                Back
              </Button>
            )}
            <SubmitButton
              isLoading={isSubmitting}
              type="submit"
              isDisabled={isDisabled}
              onClick={exportMetadata}
            >
              Next
            </SubmitButton>
          </Flex>
        </VStack>
      </form>
    </VStack>
  );
};
