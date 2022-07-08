import {
  AspectRatio,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  // Textarea,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import React, { useState } from 'react';

import { Token } from '../3DTokenTemplate/Token';

const NFT3DMetadataForm: React.FC<{
  onBack?: () => void;
  onSubmit?: (metadataUri: string) => void | Promise<void>;
}> = () => {
  // const [bgIndex, setBgIndex] = useState<number>(0);
  // const [gemIndex, setGemIndex] = useState<number>(0);
  const [starLength, setStarLength] = useState<number>(3);
  const [name, setName] = useState<string>('Special Chain');
  const [description] = useState<string>(
    'Award for exceptional performance in Special Chain!',
  );

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
        <AspectRatio ratio={1} w="100%" maxW={{ base: '100%', lg: '50%' }}>
          <Flex
            w="100%"
            h="100%"
            justify="center"
            align="center"
            zIndex={2}
            borderRadius="md"
          >
            <Token
              starLength={starLength}
              name={name}
              description={description}
            />
          </Flex>
        </AspectRatio>
        <VStack
          spacing={4}
          align="flex-start"
          w="100%"
          maxW={{ base: '100%', lg: '60%' }}
        >
          {/*
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
          </FormControl> */}
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
              <SliderThumb boxSize={5} ml={-1} />
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
          {/*
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
          </FormControl> */}
        </VStack>
      </Stack>
    </VStack>
  );
};

export default NFT3DMetadataForm;
