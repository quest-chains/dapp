import { SmallCloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Image,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Edit from '@/assets/Edit.svg';
import { useDropFiles } from '@/hooks/useDropFiles';
import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';

import { SubmitButton } from '../SubmitButton';

const CustomNFTForm2D: React.FC<{
  chainName?: string;
  onBack?: () => void;
  onSubmit: (
    metadataUri: string,
    nftUrl: string | undefined,
    isPremium: boolean,
  ) => void | Promise<void>;
}> = ({ chainName, onBack, onSubmit }) => {
  const { files, onRemoveFile, inputProps, dropzoneProps, onOpenFiles } =
    useDropFiles({
      multiple: false,
      accept: {
        'image/*': ['.jpeg', '.png', '.jpg', '.gif'],
      },
    });

  const isDisabled = !files.length;

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
      const file = files[0];
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
      onSubmit(details, metadata.image_url, true);
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [files, name, description, onSubmit]);

  return (
    <Flex w="100%" gap={8} mb={12} flexDir="column">
      <Flex flexDir="column" w={{ md: 'xl' }} alignSelf="center">
        {files.length ? (
          <>
            {files.map((file: File) => (
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
            mb={4}
            onClick={onOpenFiles}
          >
            <input {...inputProps} color="white" />
            <Box alignSelf="center">{`Drag 'n' drop an image here`}</Box>
          </Flex>
        )}
        <FormControl isRequired>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            minLength={1}
            maxLength={35}
            id="name"
            bg="#0F172A"
            placeholder="NFT Badge Name"
            mb={4}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            minLength={1}
            maxLength={100}
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
          >
            <Image src={Edit.src} alt="Edit" mr={3} />
            To continue, upload an image
          </Button>
        )}
        {!isDisabled && (
          <SubmitButton
            isLoading={isLoading}
            type="submit"
            onClick={exportMetadata}
            w="full"
          >
            Continue to Step 3
          </SubmitButton>
        )}
      </Flex>
    </Flex>
  );
};

export default CustomNFTForm2D;
