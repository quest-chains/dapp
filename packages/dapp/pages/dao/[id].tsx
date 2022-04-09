/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Box, VStack } from '@chakra-ui/react';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { progress } from '@/utils/mockData';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Dao: React.FC<Props> = ({ dao }) => {
  return (
    <VStack>
      <Box>Name: {dao?.name}</Box>
      <Box>Completed: {dao?.completed}</Box>
      <Box>Total: {dao?.total}</Box>
    </VStack>
  );
};

type QueryParams = { id: string };

export async function getStaticPaths() {
  // Call an external API endpoint to get posts

  const ids = progress.map(dao => dao.name.toString());

  // Get the paths we want to pre-render based on posts
  const paths = ids.map(id => ({
    params: { id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const id = context.params?.id;

  const dao = progress.find(dao => dao.name.toString() === id);

  return {
    props: {
      dao,
    },
    revalidate: 1,
  };
};

export default Dao;
