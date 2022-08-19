import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';

import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';

import { SubmitButton } from '../SubmitButton';

const CustomNFTMetadataForm: React.FC<{
  chainName?: string;
  onBack?: () => void;
  onSubmit: (metadataUri: string) => void | Promise<void>;
}> = ({ chainName, onBack, onSubmit }) => {
  const [myFiles, setMyFiles] = useState<File[]>([]);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setMyFiles([...myFiles, ...acceptedFiles]);
    },
    [myFiles],
  );

  const removeFile = (file: File) => () => {
    const newFiles = [...myFiles];
    newFiles.splice(newFiles.indexOf(file), 1);
    setMyFiles(newFiles);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
    },
  });

  const [name, setName] = useState<string>('Special Chain');
  const [description, setDescription] = useState<string>(
    'Award for exceptional performance in Special Chain!',
  );
  useEffect(() => {
    if (chainName) {
      setName(chainName);
      setDescription(`Award for exceptional performance in ${chainName}!`);
    }
  }, [chainName]);

  const [isLoading, setLoading] = useState(false);
  const exportMetadata = useCallback(async () => {
    setLoading(true);
    let tid = toast.loading('Uploading image to IPFS via web3.storage');
    try {
      const file = myFiles[0];
      let hash = await uploadFiles([file]);

      const metadata: Metadata = {
        name,
        description,
        image_url: `ipfs://${hash}`,
      };

      toast.dismiss(tid);
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      hash = await uploadMetadata(metadata);
      const details = `ipfs://${hash}`;
      toast.dismiss(tid);
      onSubmit(details);
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [myFiles, name, description, onSubmit]);

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={8}
      boxShadow="inset 0px 0px 0px 1px white"
      borderRadius={30}
      px={{ base: 4, md: 8 }}
      py={8}
    >
      <HStack justify="space-between" w="100%">
        <Text color="main" fontSize={20}>
          QUEST CHAIN CUSTOM NFT
        </Text>
      </HStack>
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
                boxShadow="inset 0px 0px 0px 1px white"
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
            boxShadow="inset 0px 0px 0px 1px white"
          >
            Back
          </Button>
        )}
        <SubmitButton
          isLoading={isLoading}
          type="submit"
          onClick={exportMetadata}
        >
          Next
        </SubmitButton>
      </Flex>
    </VStack>
  );
};

export default CustomNFTMetadataForm;
