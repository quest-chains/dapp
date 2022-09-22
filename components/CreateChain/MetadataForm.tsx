import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import Edit from '@/assets/Edit.svg';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useDropFiles } from '@/hooks/useDropFiles';
import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { isSupportedNetwork, useWallet } from '@/web3';

export const MetadataForm: React.FC<{
  onBack?: () => void;
  onSubmit: (
    name: string,
    description: string,
    metadataUri: string,
    imageUrl?: string,
  ) => void | Promise<void>;
}> = ({ onBack, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { files, onRemoveFile, inputProps, dropzoneProps, onOpenFiles } =
    useDropFiles({
      multiple: false,
      accept: {
        'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
      },
    });

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
      let imageUrl;
      if (files.length) {
        tid = toast.loading('Uploading image to IPFS via web3.storage');
        const file = files[0];
        const imageHash = await uploadFiles([file]);
        imageUrl = `ipfs://${imageHash}`;
        metadata.image_url = imageUrl;
        toast.dismiss(tid);
      }
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      const hash = await uploadMetadata(metadata);
      const metadataUri = `ipfs://${hash}`;
      toast.dismiss(tid);

      await onSubmit(name, description, metadataUri, imageUrl);
    } catch (error) {
      if (tid) {
        toast.dismiss(tid);
      }
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }, [name, description, onSubmit, files]);

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={10}
      boxShadow="inset 0px 0px 0px 1px white"
      borderRadius={10}
      px={{ base: 4, md: 12 }}
      py={8}
    >
      <HStack w="100%">
        <Box
          py={1}
          px={3}
          borderWidth={1}
          borderColor="gray.500"
          color="gray.500"
          borderRadius={4}
          mr={4}
        >
          STEP 1
        </Box>
        <Text fontWeight="bold" fontSize={16}>
          Quest chain details
        </Text>
      </HStack>
      <form>
        <Flex
          w="100%"
          align="flex-start"
          gap={{ base: 0, md: 20 }}
          mb={14}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <VStack w={{ base: 'full', md: '50%' }} spacing={4}>
            <Flex w="full" flexDir="column" gap={2}>
              <Flex alignSelf="start">Name</Flex>
              <Input
                color="white"
                value={name}
                bg="#0F172A"
                id="name"
                onChange={e => setName(e.target.value)}
                placeholder="Quest Chain Name"
              />
            </Flex>
            <Flex w="full" flexDir="column" gap={2}>
              <Flex alignSelf="start">Description</Flex>
              <MarkdownEditor
                height="12rem"
                value={description}
                placeholder="Quest Chain Description"
                onChange={setDescription}
              />
            </Flex>
          </VStack>
          <FormControl
            w={{ base: 'full', md: '50%' }}
            position="relative"
            top="1.5rem"
          >
            <Flex alignSelf="start">Cover Image (optional)</Flex>

            {files.length ? (
              <>
                {files.map((file: File) => (
                  <Flex key={file.name} pos="relative">
                    {typeof window !== 'undefined' && (
                      <Image
                        alt=""
                        maxH="17rem"
                        w="auto"
                        src={window.URL.createObjectURL(file)}
                      />
                    )}
                    <IconButton
                      pos="absolute"
                      size="sm"
                      top={2}
                      left={2}
                      borderRadius="full"
                      onClick={() => onRemoveFile(file)}
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
                {...dropzoneProps}
                flexDir="column"
                borderWidth={1}
                borderStyle="dashed"
                borderRadius={20}
                p={10}
                h="16.5rem"
                onClick={onOpenFiles}
              >
                <input {...inputProps} color="white" />
                <Flex
                  height="16rem"
                  alignSelf="center"
                  alignItems="center"
                >{`Drag 'n' drop an image here`}</Flex>
              </Flex>
            )}
          </FormControl>
        </Flex>
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
          {isDisabled && (
            <Button
              borderWidth={1}
              borderColor="white"
              height={{ base: 10, md: 12 }}
              px={5}
              borderRadius="full"
              isDisabled
              w="full"
            >
              <Image src={Edit.src} alt="Edit" mr={3} />
              <Text fontSize={{ base: 12, md: 16 }}>
                To continue, enter Name and Description
              </Text>
            </Button>
          )}
          {!isDisabled && (
            <SubmitButton
              isLoading={isSubmitting}
              type="submit"
              isDisabled={isDisabled}
              onClick={exportMetadata}
              w="full"
            >
              Continue to Step 2
            </SubmitButton>
          )}
        </Flex>
      </form>
    </VStack>
  );
};
