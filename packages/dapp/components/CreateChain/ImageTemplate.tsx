import {
  AspectRatio,
  Flex,
  Image,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  ForwardedRef,
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from 'react';

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
    const [width, setWidth] = useState<number>(0);
    useEffect(() => {
      const getSize = () => {
        const node = (ref as RefObject<HTMLDivElement>)?.current;
        if (node) {
          setWidth(node.clientWidth);
        }
      };
      getSize();
      window.addEventListener('resize', getSize);
      return () => {
        window.removeEventListener('resize', getSize);
      };
    }, [ref]);

    const titleFontSize = useMemo(() => `${0.045 * width}px`, [width]);
    const titleLineHeight = useMemo(() => `${0.05 * width}px`, [width]);
    const descriptionFontSize = useMemo(() => `${0.025 * width}px`, [width]);
    const logoFontSize = useMemo(() => `${0.03 * width}px`, [width]);
    const starSize = useMemo(() => `${0.06 * width}px`, [width]);

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
            left="29%"
            maxW="50%"
            fontSize={titleFontSize}
            lineHeight={titleLineHeight}
          >
            {name}
          </Text>
          <Flex
            h="1px"
            w="54%"
            bg="white"
            pos="absolute"
            left="30%"
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
            left="30%"
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
