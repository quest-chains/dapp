import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useDropImage } from '@/hooks/useDropFiles';
import { useInputText } from '@/hooks/useInputText';
import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { isSupportedNetwork, useWallet } from '@/web3';

import { UploadImageForm } from '../UploadImageForm';

export const MetadataForm: React.FC<{
  onBack?: () => void;
  onSubmit: (
    name: string,
    description: string,
    metadataUri: string,
    imageUrl?: string,
  ) => void | Promise<void>;
}> = ({ onBack, onSubmit }) => {
  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();

  const uploadImageProps = useDropImage();
  const { imageFile } = uploadImageProps;

  const { isConnected, chainId } = useWallet();

  const isDisabled = !isConnected || !isSupportedNetwork(chainId);

  const [isSubmitting, setSubmitting] = useState(false);

  const exportMetadata = useCallback(async () => {
    let tid;
    try {
      setSubmitting(true);
      const metadata: Metadata = {
        name: nameRef.current,
        description: descRef.current,
      };
      let imageUrl;
      if (imageFile) {
        tid = toast.loading('Uploading image to IPFS via web3.storage');
        const imageHash = await uploadFiles([imageFile]);
        imageUrl = `ipfs://${imageHash}`;
        metadata.image_url = imageUrl;
        toast.dismiss(tid);
      }
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      const hash = await uploadMetadata(metadata);
      const metadataUri = `ipfs://${hash}`;
      toast.dismiss(tid);

      await onSubmit(nameRef.current, descRef.current, metadataUri, imageUrl);
      setName('');
      setDescription('');
    } catch (error) {
      if (tid) {
        toast.dismiss(tid);
      }
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }, [nameRef, descRef, onSubmit, imageFile, setName, setDescription]);

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
            <FormControl w="full" isRequired={true}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                color="white"
                defaultValue={nameRef.current}
                bg="#0F172A"
                id="name"
                onChange={e => setName(e.target.value)}
                placeholder="Quest chain name"
              />
            </FormControl>
            <FormControl w="full" isRequired={true}>
              <FormLabel htmlFor="description">Description</FormLabel>
              <MarkdownEditor
                height="12rem"
                value={descRef.current}
                placeholder="Quest chain description"
                onChange={setDescription}
              />
            </FormControl>
          </VStack>
          <UploadImageForm
            {...uploadImageProps}
            label="Cover Image (optional)"
            formControlProps={{
              w: { base: 'full', md: '50%' },
              position: 'relative',
              top: '1.5rem',
            }}
            imageProps={{
              maxHeight: '16rem',
              w: 'auto',
            }}
            dropzoneProps={{
              ...uploadImageProps.dropzoneProps,
              height: '16rem',
            }}
          />
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
          <SubmitButton
            isLoading={isSubmitting}
            isDisabled={isDisabled}
            onClick={() => {
              if (!nameRef.current || !descRef.current) {
                toast.error('Please enter a name & description');
                return;
              }
              exportMetadata();
            }}
            w="full"
          >
            Continue to Step 2
          </SubmitButton>
        </Flex>
      </form>
    </VStack>
  );
};
