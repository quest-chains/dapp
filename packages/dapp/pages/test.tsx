import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { Token } from '@/components/3DTokenTemplate/Token';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Test: React.FC<Props> = () => {
  return (
    <VStack
      w="100%"
      h="100%"
      align="stretch"
      px={{ base: 0, lg: 12 }}
      spacing={8}
    >
      <Head>
        <title>3D Token Test</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <HStack justify="space-between" w="100%">
        <Text color="main" fontSize={20}>
          3D Token Test
        </Text>
      </HStack>
      <Flex h="30rem">
        <Token />
      </Flex>
    </VStack>
  );
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default Test;
