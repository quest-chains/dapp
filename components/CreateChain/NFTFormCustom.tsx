import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDropImage } from '@/hooks/useDropFiles';
import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';

import { EditIcon } from '../icons/EditIcon';
import { SubmitButton } from '../SubmitButton';
import { UploadImageForm } from '../UploadImageForm';

const CustomNFTForm2D: React.FC<{
  chainName?: string;
  onBack?: () => void;
  onSubmit: (
    metadataUri: string,
    nftUrl: string | undefined,
  ) => void | Promise<void>;
  submitLabel?: string;
  show: boolean;
}> = ({ chainName, onBack, onSubmit, submitLabel, show }) => {
  const uploadImageProps = useDropImage();
  const { imageFile } = uploadImageProps;

  const isDisabled = !imageFile;

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
    if (!imageFile) return;
    setLoading(true);
    let tid = toast.loading('Uploading image to IPFS via web3.storage');
    try {
      let hash = await uploadFiles([imageFile]);

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
      onSubmit(details, metadata.image_url);
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [imageFile, name, description, onSubmit]);

  return (
    <Flex
      w="100%"
      gap={8}
      mb={12}
      flexDir="column"
      display={show ? 'flex' : 'none'}
    >
      <Flex flexDir="column" w={{ md: 'xl' }} alignSelf="center">
        <UploadImageForm
          {...uploadImageProps}
          imageProps={{ height: '16rem' }}
          formControlProps={{ mb: '4' }}
        />
        <FormControl isRequired>
          <Flex align="center" justify="space-between" w="100%">
            <FormLabel htmlFor="name">Name</FormLabel>
            <Text fontSize="sm">{name.length} / 36</Text>
          </Flex>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            minLength={1}
            maxLength={36}
            id="name"
            bg="#0F172A"
            placeholder="NFT Badge Name"
            mb={4}
          />
        </FormControl>
        <FormControl isRequired>
          <Flex align="center" justify="space-between" w="100%">
            <FormLabel htmlFor="description">Description</FormLabel>
            <Text fontSize="sm">{description.length} / 120</Text>
          </Flex>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            minLength={1}
            maxLength={120}
            bg="#0F172A"
            placeholder="NFT Badge Description"
          />
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
            leftIcon={<EditIcon />}
          >
            To continue, upload an image
          </Button>
        )}
        {!isDisabled && (
          <SubmitButton isLoading={isLoading} onClick={exportMetadata} w="full">
            {submitLabel}
          </SubmitButton>
        )}
      </Flex>
    </Flex>
  );
};

export default CustomNFTForm2D;
