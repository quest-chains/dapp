import { VStack } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import { getGlobalInfo } from '@/graphql/globalInfo';

const TestComponent = dynamic(
  () => import('@/components/NFTTemplate/TestComponent'),
  { ssr: false },
);

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Test: React.FC<Props> = () => {
  return (
    <VStack w="100%" align="stretch" px={{ base: 0, lg: 40 }} spacing={8}>
      <Head>
        <title>Test</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <TestComponent />
    </VStack>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      globalInfo: await getGlobalInfo(),
    },
  };
};

export default Test;
