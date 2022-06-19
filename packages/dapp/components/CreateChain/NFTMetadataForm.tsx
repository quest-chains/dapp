import {
  AspectRatio,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Textarea,
  Tooltip,
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
      px={{ base: 4, md: 8 }}
      py={8}
    >
      <HStack justify="space-between" w="100%">
        <Text color="main" fontSize={20}>
          QUEST CHAIN NFT
        </Text>
      </HStack>
      <Stack
        w="100%"
        direction={{ base: 'column', lg: 'row-reverse' }}
        spacing={{ base: 8, lg: 0 }}
      >
        <Flex
          justify="center"
          align="center"
          flex={1}
          backdropFilter="blur(8px)"
          zIndex={2}
          borderRadius="md"
        >
          <ImageTemplate
            bgIndex={bgIndex}
            gemIndex={gemIndex}
            starLength={starLength}
            name={name}
            description={description}
            ref={componentRef}
          />
        </Flex>
        <VStack
          spacing={4}
          align="flex-start"
          w="100%"
          maxW={{ base: '100%', lg: '60%' }}
        >
          <FormControl isRequired>
            <FormLabel color="main" htmlFor="description">
              Background Shape
            </FormLabel>
            <HStack>
              {backgrounds.map((bg, bgId) => (
                <Tooltip label={`${backgroundNames[bgId]} Background`} key={bg}>
                  <Button
                    w="6rem"
                    h="6rem"
                    isDisabled={bgId === bgIndex}
                    _disabled={{
                      boxShadow: 'inset 0px 0px 0px 1px #AD90FF',
                      cursor: 'not-allowed',
                      opacity: 0.8,
                    }}
                    onClick={() => setBgIndex(bgId)}
                    px={2}
                  >
                    <Image
                      w="100%"
                      h="100%"
                      src={backgrounds[bgId]}
                      alt={`${backgroundNames[bgId]} Background`}
                    />
                  </Button>
                </Tooltip>
              ))}
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="main" htmlFor="description">
              Gem
            </FormLabel>
            <HStack>
              <Wrap maxW="45rem">
                {gems.map((gem, gemId) => (
                  <Tooltip label={`${gemNames[gemId]} Gem`} key={gem}>
                    <AspectRatio
                      ratio={1}
                      w={{ base: '3rem', md: '5rem', xl: '6rem' }}
                    >
                      <Button
                        w="100%"
                        h="100%"
                        isDisabled={gemId === gemIndex}
                        _disabled={{
                          boxShadow: 'inset 0px 0px 0px 1px #AD90FF',
                          cursor: 'not-allowed',
                          opacity: 0.8,
                        }}
                        onClick={() => setGemIndex(gemId)}
                        px={0}
                      >
                        <Flex
                          w="100%"
                          h="100%"
                          bgImage={gems[gemId]}
                          bgSize="175%"
                          bgPos="center center"
                        />
                      </Button>
                    </AspectRatio>
                  </Tooltip>
                ))}
              </Wrap>
            </HStack>
          </FormControl>
          <FormControl isRequired>
            <FormLabel color="main" htmlFor="description">
              Number of Stars
            </FormLabel>
            <Slider
              value={starLength}
              onChange={v => setStarLength(v)}
              min={1}
              max={3}
              step={1}
              w="100%"
              maxW="20rem"
              mb={2}
            >
              <SliderMark value={1} mt={3} fontSize="sm">
                1
              </SliderMark>
              <SliderMark value={2} mt={3} fontSize="sm">
                2
              </SliderMark>
              <SliderMark value={3} mt={3} fontSize="sm">
                3
              </SliderMark>
              <SliderTrack bg="#444444" h={2} borderRadius="full">
                <SliderFilledTrack bg="#AD90FF" opacity="1" />
              </SliderTrack>
              <SliderThumb boxSize={4} ml={2} />
            </Slider>
          </FormControl>
          <Wrap>
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
      </Stack>
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
