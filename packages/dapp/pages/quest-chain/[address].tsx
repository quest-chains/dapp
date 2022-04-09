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
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';

import {
  getQuestChainAddresses,
  getQuestChainInfo,
} from '@/graphql/questChains';

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const QuestChain: React.FC<Props> = ({ questChain }) => {
  const { isFallback } = useRouter();
  if (isFallback) {
    return (
      <VStack>
        <Spinner color="main" />
      </VStack>
    );
  }
  if (!questChain) {
    return (
      <VStack>
        <Text> Quest Chain not found! </Text>
      </VStack>
    );
  }
  return (
    <VStack>
      <Box>Name: {questChain.name}</Box>
      <Box>Description: {questChain.description}</Box>

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

type QueryParams = { address: string };

export async function getStaticPaths() {
  const addresses = await getQuestChainAddresses(1000);
  const paths = addresses.map(address => ({
    params: { address },
  }));

  return { paths, fallback: true };
}

export const getStaticProps = async (
  context: GetStaticPropsContext<QueryParams>,
) => {
  const address = context.params?.address;

  const questChain = address ? await getQuestChainInfo(address) : null;

  return {
    props: {
      questChain,
    },
    revalidate: 1,
  };
};

export default QuestChain;
