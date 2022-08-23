import {
  AspectRatio,
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
  Textarea,
  Tooltip,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { handleError } from '@/utils/helpers';
import { Metadata, uploadFiles, uploadMetadata } from '@/utils/metadata';
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

const NFTForm2D: React.FC<{
  chainName?: string;
  onBack?: () => void;
  onSubmit: (
    metadataUri: string,
    nftUrl: string | undefined,
    isPremium: boolean,
  ) => void | Promise<void>;
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
      let hash = await uploadFiles([file]);
      const metadata: Metadata = {
        name,
        description,
        image_url: `ipfs://${hash}`,
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
      hash = await uploadMetadata(metadata);
      const details = `ipfs://${hash}`;
      toast.dismiss(tid);
      onSubmit(details, metadata.image_url, false);
    } catch (error) {
      toast.dismiss(tid);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [onSubmit, bgIndex, gemIndex, starLength, name, description]);

  return (
    <VStack w="100%" align="stretch" spacing={8}>
      <Flex
        w="100%"
        flexDirection={{ base: 'column', lg: 'row-reverse' }}
        mb={12}
      >
        <Flex
          justify="center"
          align="center"
          flex={1}
          backdropFilter="blur(8px)"
          zIndex={2}
          borderRadius="md"
          gap={4}
          maxW={{ base: '100%', lg: '50%' }}
          flexDir="column"
        >
          <ImageTemplate
            bgIndex={bgIndex}
            gemIndex={gemIndex}
            starLength={starLength}
            name={name}
            description={description}
            ref={componentRef}
          />
          <FormControl isRequired>
            <FormLabel htmlFor="name" fontWeight="bold">
              Name
            </FormLabel>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              minLength={1}
              maxLength={35}
              id="name"
              bg="#0F172A"
              placeholder="NFT Badge Name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="description" fontWeight="bold">
              Description
            </FormLabel>
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
          gap={8}
          flex={1}
          align="flex-start"
          flexDir="column"
          w="100%"
          maxW={{ base: '100%', lg: '50%' }}
          pr={{ base: 0, md: 40 }}
        >
          <FormControl isRequired>
            <FormLabel htmlFor="description" fontWeight="bold">
              Background Shape
            </FormLabel>
            <HStack spacing={6}>
              {backgrounds.map((bg, bgId) => (
                <Tooltip label={`${backgroundNames[bgId]} Background`} key={bg}>
                  <Button
                    w={{ base: '3rem', md: '6rem', xl: '7rem' }}
                    h={{ base: '3rem', md: '6rem', xl: '7rem' }}
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
            <FormLabel htmlFor="description" fontWeight="bold">
              Gem
            </FormLabel>
            <HStack>
              <Wrap spacing={6}>
                {gems.map((gem, gemId) => (
                  <Tooltip label={`${gemNames[gemId]} Gem`} key={gem}>
                    <AspectRatio
                      ratio={1}
                      w={{ base: '3rem', md: '6rem', xl: '7rem' }}
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
            <FormLabel htmlFor="description" fontWeight="bold">
              Number of Stars
            </FormLabel>
            <Slider
              value={starLength}
              onChange={v => setStarLength(v)}
              min={1}
              max={3}
              step={1}
              w="100%"
              maxW="25rem"
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
              <SliderTrack
                borderWidth={1}
                borderColor="white"
                bg="#444444"
                h={3}
                borderRadius={3}
              >
                <SliderFilledTrack bg="#4E0B84" opacity="1" />
              </SliderTrack>
              <SliderThumb boxSize={5} ml={1} />
            </Slider>
          </FormControl>
        </Flex>
      </Flex>
      <Flex
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
          w="full"
        >
          Continue to Step 3
        </SubmitButton>
      </Flex>
    </VStack>
  );
};

export default NFTForm2D;
