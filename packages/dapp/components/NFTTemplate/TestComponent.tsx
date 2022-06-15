import {
  AspectRatio,
  Button,
  Flex,
  Image,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { ForwardedRef, useRef, useState } from 'react';
import { exportComponentAsPNG } from 'react-component-export-image';

import { backgrounds, gems } from '@/utils/templateHelpers';

import { PrimaryButton } from '../PrimaryButton';

type TemplateProps = {
  backgroundImage: string;
  gemImage: string;
  name: string;
  description: string;
};

const ComponentToPrint = React.forwardRef(
  (
    { backgroundImage, gemImage, name, description }: TemplateProps,
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
          src={backgroundImage}
          alt=""
          pos="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%,-50%)"
        />
        <Image
          src={gemImage}
          alt=""
          pos="absolute"
          left="53.5%"
          top="43%"
          transform="translate(-50%,-50%)"
        />
        <Text
          fontFamily="heading"
          textTransform="uppercase"
          color="white"
          pos="absolute"
          top="20%"
          left="30%"
          pr="20%"
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
          textTransform="uppercase"
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
          pr="15%"
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
      </Flex>
    </AspectRatio>
  ),
);

const TestComponent: React.FC = () => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const [bgIndex, setBgIndex] = useState<number>(0);
  const [gemIndex, setGemIndex] = useState<number>(0);
  const [name, setName] = useState<string>('Special Chain');
  const [description, setDescription] = useState<string>(
    'Award for exceptional perforance in Special Chain',
  );

  return (
    <VStack>
      <Flex justify="center" align="center" w="100%" p={8}>
        <ComponentToPrint
          backgroundImage={backgrounds[bgIndex]}
          gemImage={gems[gemIndex]}
          name={name}
          description={description}
          ref={componentRef}
        />
      </Flex>
      <VStack align="stretch">
        <Button onClick={() => setBgIndex(i => (i + 1) % backgrounds.length)}>
          Change Background
        </Button>
        <Button onClick={() => setGemIndex(i => (i + 1) % gems.length)}>
          Change Gem
        </Button>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          minLength={1}
          maxLength={40}
        />
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          minLength={1}
          maxLength={100}
        />
        <PrimaryButton
          onClick={() =>
            exportComponentAsPNG(componentRef, {
              html2CanvasOptions: { backgroundColor: null, scale: 5 },
            })
          }
        >
          Export As PNG
        </PrimaryButton>
      </VStack>
    </VStack>
  );
};

export default TestComponent;
