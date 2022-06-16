import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { handleError } from '@/utils/helpers';
import {
  Metadata,
  uploadFilesViaAPI,
  uploadMetadataViaAPI,
} from '@/utils/metadata';
import {
  backgroundNames,
  backgrounds,
  componentToPNG,
  dataURItoFile,
  gemNames,
  gems,
  stars,
} from '@/utils/templateHelpers';

import { SubmitButton } from '../SubmitButton';
import { ImageTemplate } from './ImageTemplate';

const NFTMetadataForm: React.FC<{
  chainName?: string;
  onBack?: () => void;
  onSubmit: (metadataUri: string) => void | Promise<void>;
}> = ({ chainName, onBack, onSubmit }) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const [bgIndex, setBgIndex] = useState<number>(0);
  const [gemIndex, setGemIndex] = useState<number>(0);
  const [starLength, setStarLength] = useState<number>(3);
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
      const dataURI = await componentToPNG(componentRef);
      const file = dataURItoFile(dataURI, 'badge.png');
      let hash = await uploadFilesViaAPI([file]);
      const metadata: Metadata = {
        name,
        description,
        image_url: `ipfs://${hash}/badge.png`,
        attributes: [
          {
            trait_type: 'Background',
            value: backgroundNames[bgIndex],
          },
          {
            trait_type: 'Gem',
            value: gemNames[gemIndex],
          },
          {
            display_type: 'number',
            trait_type: 'Stars',
            value: starLength,
          },
        ],
      };

      toast.dismiss(tid);
      tid = toast.loading('Uploading metadata to IPFS via web3.storage');
      hash = await uploadMetadataViaAPI(metadata);
      const details = `ipfs://${hash}`;
      toast.dismiss(tid);
      onSubmit(details);
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [onSubmit, bgIndex, gemIndex, starLength, name, description]);

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={8}
      boxShadow="inset 0px 0px 0px 1px #AD90FF"
      borderRadius={30}
      p={8}
    >
      <HStack justify="space-between" w="100%">
        <Text color="main" fontSize={20}>
          QUEST CHAIN NFT
        </Text>
      </HStack>
      <Flex justify="center" align="center" w="100%" p={8}>
        <ImageTemplate
          bgIndex={bgIndex}
          gemIndex={gemIndex}
          starLength={starLength}
          name={name}
          description={description}
          ref={componentRef}
        />
      </Flex>
      <Button onClick={() => setBgIndex(i => (i + 1) % backgrounds.length)}>
        Change Background
      </Button>
      <Button onClick={() => setGemIndex(i => (i + 1) % gems.length)}>
        Change Gem
      </Button>
      <Button onClick={() => setStarLength(i => (i % stars.length) + 1)}>
        Change Stars
      </Button>
      <form>
        <VStack spacing={4} align="flex-start" w="100%">
          <Wrap minW="20rem">
            <FormControl isRequired>
              <FormLabel color="main" htmlFor="name">
                Name
              </FormLabel>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                minLength={1}
                maxLength={35}
                id="name"
                placeholder="NFT Badge Name"
              />
            </FormControl>
          </Wrap>
          <FormControl isRequired>
            <FormLabel color="main" htmlFor="description">
              Description
            </FormLabel>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              minLength={1}
              maxLength={100}
              placeholder="NFT Badge Description"
            />
          </FormControl>
        </VStack>
      </form>
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

export default NFTMetadataForm;
