import { AspectRatio, Flex, Image, Text } from '@chakra-ui/react';
import { ForwardedRef, forwardRef } from 'react';

import {
  backgroundNames,
  backgrounds,
  gemNames,
  gems,
  stars,
} from '@/utils/templateHelpers';

export type TemplateProps = {
  bgIndex: number;
  gemIndex: number;
  starLength: number;
  name: string;
  description: string;
};

export const ImageTemplate = forwardRef(
  (
    { bgIndex, gemIndex, starLength, name, description }: TemplateProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <AspectRatio w="100%" maxW="30rem" ratio={1}>
      <Flex
        justify="center"
        align="center"
        w="100%"
        h="100%"
        background="transparent"
        position="relative"
        ref={ref}
      >
        <Image
          src={backgrounds[bgIndex]}
          alt={`${backgroundNames[bgIndex]} Background`}
          pos="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%,-50%)"
        />
        <Image
          src={gems[gemIndex]}
          alt={`${gemNames[gemIndex]} Gem`}
          pos="absolute"
          left="53.5%"
          top="43%"
          transform="translate(-50%,-50%)"
        />
        <Text
          fontFamily="heading"
          color="white"
          pos="absolute"
          top="20%"
          left="30%"
          maxW="50%"
          fontSize="xl"
        >
          {name}
        </Text>
        <Flex
          h="1px"
          w="53%"
          bg="white"
          pos="absolute"
          left="31%"
          bottom="37%"
          borderRadius="full"
          opacity="0.5"
        />
        <Text
          color="main"
          fontFamily="heading"
          fontSize="sm"
          fontWeight="normal"
          lineHeight="1rem"
          pos="absolute"
          bottom="38.5%"
          left="31%"
        >
          Quest Chains
        </Text>
        <Text
          color="white"
          fontSize="xs"
          fontWeight="normal"
          lineHeight="1rem"
          pos="absolute"
          top="64.5%"
          left="52%"
          maxW="33%"
        >
          {description}
        </Text>
        <Flex
          w="1px"
          h="15%"
          bg="white"
          pos="absolute"
          left="50%"
          bottom="22%"
          borderRadius="full"
          opacity="0.5"
        />
        {new Array(starLength).fill(1).map((_val, index) => (
          <Image
            src={stars[index]}
            key={stars[index]}
            alt=""
            pos="absolute"
            left="43%"
            bottom="30%"
            transform={`scale(0.8) translateX(${index * -50}%)`}
          />
        ))}
      </Flex>
    </AspectRatio>
  ),
);
