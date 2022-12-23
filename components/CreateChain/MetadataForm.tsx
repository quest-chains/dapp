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
import { isSupportedNetwork, useWallet } from '@/web3';

import { UploadImageForm } from '../UploadImageForm';

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const makeId = () => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

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
  const [slug, setSlug] = useState('');
  const { getQuestChainsFromSlug } = graphql;

  const uploadImageProps = useDropImage();
  const { imageFile } = uploadImageProps;

  const { isConnected, chainId } = useWallet();

  const [slugAvailable, setSlugAvailable] = useState(true);

  const isDisabled =
    !isConnected ||
    !isSupportedNetwork(chainId) ||
    !slugAvailable ||
    slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) === null ||
    ethers.utils.isAddress(slug);

  const [isSubmitting, setSubmitting] = useState(false);

  const fetchSearchResults = async (slug: string) => {
    if (chainId) {
      const qcFromSlug = await getQuestChainsFromSlug(chainId, slug);
      if (qcFromSlug.length === 0) {
        setSlugAvailable(true);
        setSlug(slug);
      } else {
        setSlugAvailable(false);
        setSlug(`${slug}${makeId()}`);
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
        slug,
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
        slug,
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
    slug,
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
                fetchSearchResults(slugify(e.target.value));
              }}
              placeholder="Quest chain name"
            />
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
