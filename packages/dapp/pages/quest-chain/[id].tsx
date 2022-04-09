/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';

import { progress } from '@/utils/mockData';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const QuestChain: React.FC<Props> = ({ dao }) => {
  return (
    <VStack>
      <Box>DAO name: {dao?.name}</Box>
      <Box>Quest Chain Name: {dao?.questChainName}</Box>
      <Box>Completed: {dao?.completed}</Box>
      <Box>Total: {dao?.total}</Box>

      <Formik
        initialValues={{}}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            // if deleting/re adding quests, some values become empty. we need to filter out these quests when
            // we decide to send the data! (const quests = values.quests.filter(quest => quest.name))
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {props => (
          <Form>
            <Flex w="full" gap={20} alignItems="normal">
              <Flex flexGrow={1} flexDirection="column">
                <Text mb={6} color="main" fontSize={20}>
                  Add a quest to the quest chain
                </Text>
                <Flex
                  flexDir="column"
                  boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  p={8}
                  borderRadius={30}
                >
                  <HStack mb={4}>
                    <Field name="questName">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl isRequired>
                          <FormLabel color="main" htmlFor="questName">
                            Quest Name
                          </FormLabel>
                          <Input
                            {...field}
                            id="questName"
                            placeholder="Quest Name"
                          />
                          <FormErrorMessage>
                            {form.errors.questName}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="questDescription">
                      {({ field, form }: { field: any; form: any }) => (
                        <FormControl isRequired>
                          <FormLabel color="main" htmlFor="questDescription">
                            Quest Description
                          </FormLabel>
                          <Input
                            {...field}
                            id="questDescription"
                            placeholder="Quest Description"
                          />
                          <FormErrorMessage>
                            {form.errors.questDescription}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </HStack>
                </Flex>
              </Flex>

              {/* Right Column, Quests Creator */}
            </Flex>

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
              float="right"
            >
              Add
            </Button>
          </Form>
        )}
      </Formik>
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

export default QuestChain;
