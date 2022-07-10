import { VStack } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import NFT3DMetadataForm from '@/components/CreateChain/3DNFTMetadataForm';

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
        <title>Quest Chain 3D NFT</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NFT3DMetadataForm
        submitLabel={'Submit'}
        onSubmit={(uri: string) =>
          alert(`Successfully created Metadata URI: "${uri}"`)
        }
      />
    </VStack>
  );
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default Test;
