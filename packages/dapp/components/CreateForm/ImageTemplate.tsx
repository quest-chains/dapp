import {
  AspectRatio,
  Flex,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
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
  ) => {
    const titleFontSize = useBreakpointValue({
      base: '3vw',
      sm: 'lg',
      md: 'xl',
    });

    const descriptionFontSize = useBreakpointValue({
      base: '1.5vw',
      sm: '2vw',
      md: 'xs',
    });

    const logoFontSize = useBreakpointValue({
      base: '1.5vw',
      sm: '1.5vw',
      md: 'sm',
    });

    const starSize = useBreakpointValue({
      base: '4vw',
      sm: '4.5vw',
      md: '2rem',
    });

    return (
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
            fontSize={titleFontSize}
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
            fontWeight="normal"
            pos="absolute"
            bottom="38%"
            left="31%"
            fontSize={logoFontSize}
          >
            Quest Chains
          </Text>
          <Text
            color="white"
            fontSize={descriptionFontSize}
            fontWeight="normal"
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
              boxSize={starSize}
              transform={`scale(0.8) translateX(${index * -55}%)`}
            />
          ))}
        </Flex>
      </AspectRatio>
    );
  },
);
