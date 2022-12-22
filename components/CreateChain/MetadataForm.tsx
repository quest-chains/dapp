import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { graphql } from '@quest-chains/sdk';
import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SubmitButton } from '@/components/SubmitButton';
import { useDropImage } from '@/hooks/useDropFiles';
import { useInputText } from '@/hooks/useInputText';
import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
import { AVAILABLE_NETWORK_INFO, isSupportedNetwork, useWallet } from '@/web3';

import { UploadImageForm } from '../UploadImageForm';

export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const MetadataForm: React.FC<{
  onBack?: () => void;
  onSubmit: (
    name: string,
    description: string,
    metadataUri: string,
    slug?: string,
    imageUrl?: string,
  ) => void | Promise<void>;
}> = ({ onBack, onSubmit }) => {
  const [nameRef, setName] = useInputText();
  const [descRef, setDescription] = useInputText();
  const [slugRef, setSlug] = useState('');
  const { getQuestChainsFromSlug } = graphql;

  const uploadImageProps = useDropImage();
  const { imageFile } = uploadImageProps;

  const { isConnected, chainId } = useWallet();

  const [slugAvailable, setSlugAvailable] = useState(true);

  const isDisabled =
    !isConnected ||
    !isSupportedNetwork(chainId) ||
    !slugAvailable ||
    slugRef.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) === null ||
    ethers.utils.isAddress(slugRef);

  const [isSubmitting, setSubmitting] = useState(false);

  const fetchSearchResults = async (slug: string) => {
    if (chainId) {
      const qcFromSlug = await getQuestChainsFromSlug(chainId, slug);

      if (qcFromSlug.length === 0) {
        setSlugAvailable(true);
      } else {
        setSlugAvailable(false);
      }
    }
  };

  const exportMetadata = useCallback(async () => {
    let tid;
    try {
      setSubmitting(true);
      const metadata: Metadata = {
        name: nameRef.current,
        description: descRef.current,
        slug: slugRef,
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

      await onSubmit(
        nameRef.current,
        descRef.current,
        metadataUri,
        slugRef,
        imageUrl,
      );
      setName('');
      setDescription('');
      setSlug('');
    } catch (error) {
      if (tid) {
        toast.dismiss(tid);
      }
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  }, [
    nameRef,
    descRef,
    slugRef,
    onSubmit,
    imageFile,
    setName,
    setDescription,
    setSlug,
  ]);

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
        <VStack w="100%" align="stretch" mb={10} spacing={4}>
          <FormControl w="full" isRequired={true}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              color="white"
              defaultValue={nameRef.current}
              bg="#0F172A"
              id="name"
              onChange={e => {
                setName(e.target.value);
                setSlug(slugify(e.target.value));
                fetchSearchResults(slugify(e.target.value));
              }}
              placeholder="Quest chain name"
            />
          </FormControl>
          <FormControl
            w="full"
            isInvalid={
              (!slugAvailable ||
                slugRef.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) === null ||
                ethers.utils.isAddress(slugRef)) &&
              slugRef !== ''
            }
          >
            <FormLabel htmlFor="name">
              URL Slug
              {chainId && (
                <Text
                  ml={1}
                  display="inline-block"
                  fontStyle="italic"
                  fontSize="sm"
                  color="gray.500"
                >
                  (will appear as questchains.xyz/
                  {AVAILABLE_NETWORK_INFO[chainId].urlName}/{slugify(slugRef)})
                </Text>
              )}
            </FormLabel>
            <Input
              color="white"
              value={slugRef}
              bg="#0F172A"
              id="name"
              onChange={e => {
                setSlug(e.target.value);
                fetchSearchResults(e.target.value);
              }}
              placeholder="Quest chain slug"
            />
            {!slugAvailable && (
              <FormErrorMessage>Slug is not available.</FormErrorMessage>
            )}
            {(slugRef.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) === null ||
              ethers.utils.isAddress(slugRef)) && (
              <FormErrorMessage>This is not a valid slug.</FormErrorMessage>
            )}
          </FormControl>
          <FormControl w="full" isRequired={true}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <MarkdownEditor
              value={descRef.current}
              placeholder="Quest chain description"
              onChange={setDescription}
            />
          </FormControl>
          <UploadImageForm
            {...uploadImageProps}
            label="Cover Image (optional)"
            formControlProps={{
              w: '100%',
              position: 'relative',
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
        </VStack>
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
