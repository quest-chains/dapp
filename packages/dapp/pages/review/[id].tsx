/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import { Box, Button, Flex, VStack } from '@chakra-ui/react';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { reviews } from '@/utils/mockData';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const onAccept = ({ id }: { id: number }) => {
  console.log(id);
};
const onReject = ({ id }: { id: number }) => {
  console.log(id);
};

const Review: React.FC<Props> = ({ review }) => {
  return (
    <VStack>
      <Head>
        <title>Review</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box>Address: {review?.address}</Box>
      <VStack>
        {review?.submissions.map(({ id, status }) => (
          <Flex key={id}>
            <Box mr={2}>id: {id}</Box>
            <Box>status: {status}</Box>
            <Button onClick={() => onAccept({ id })}>Accept</Button>
            <Button onClick={() => onReject({ id })}>Reject</Button>
          </Flex>
        ))}
      </VStack>
    </VStack>
  );
};

type QueryParams = { id: string };

export async function getStaticPaths() {
  // Call an external API endpoint to get posts

  const ids = reviews.map(review => review.id.toString());

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

  const review = reviews.find(review => review.id.toString() === id);

  return {
    props: {
      review,
    },
    revalidate: 1,
  };
};

export default Review;
