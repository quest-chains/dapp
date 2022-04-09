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
  Textarea,
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik } from 'formik';
import { useState } from 'react';

interface MyFormValues {
  daoName: string;
  quests: [
    {
      name: string;
      description: string;
    },
  ];
  coreMemberAddresses: string[];
}

const Create: React.FC = () => {
  const [questIndex, setQuestIndex] = useState(0);

  const initialValues: MyFormValues = {
    daoName: '',
    coreMemberAddresses: [],
    quests: [
      {
        name: '',
        description: '',
      },
    ],
  };

  return (
    <Formik
      initialValues={initialValues}
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
            {/* Left Column: DAO Name, Quest Chain title, Core Member Addresses */}
            <Flex flexGrow={1} flexDirection="column">
              <Text mb={6} color="main" fontSize={20}>
                QUEST CHAIN INFO
              </Text>
              <Flex
                flexDir="column"
                boxShadow="inset 0px 0px 0px 1px #AD90FF"
                p={8}
                borderRadius={30}
              >
                <HStack mb={4}>
                  <Field name="daoName">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel color="main" htmlFor="daoName">
                          DAO Name
                        </FormLabel>
                        <Input {...field} id="daoName" placeholder="DAO Name" />
                        <FormErrorMessage>
                          {form.errors.daoName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="questChainName">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel color="main" htmlFor="questChainName">
                          Quest Chain Title
                        </FormLabel>
                        <Input
                          {...field}
                          id="questChainName"
                          placeholder="Quest Chain Title"
                        />
                        <FormErrorMessage>
                          {form.errors.questChainName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <FieldArray
                  name="coreMemberAddresses"
                  render={arrayHelpers => (
                    <Box>
                      <FormLabel color="main" htmlFor="daoName">
                        Core Member Addresses
                      </FormLabel>
                      {props.values.coreMemberAddresses.map(
                        (address, index) => (
                          <HStack key={index} mb={2}>
                            <Field name={`coreMemberAddresses.${index}`}>
                              {({ field }: { field: any }) => (
                                <FormControl isRequired>
                                  <Input
                                    {...field}
                                    id={`coreMemberAddresses.${index}`}
                                    placeholder="Core Member Address"
                                  />
                                </FormControl>
                              )}
                            </Field>
                            <Button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              -
                            </Button>
                          </HStack>
                        ),
                      )}
                      <Button
                        type="button"
                        onClick={() => arrayHelpers.push('')}
                      >
                        Add address
                      </Button>
                    </Box>
                  )}
                />
              </Flex>
            </Flex>

            {/* Right Column, Quests Creator */}
            <Flex flexGrow={1} flexDirection="column">
              <Text mb={6} color="main" fontSize={20}>
                QUESTS
              </Text>
              <Flex flexDir="column" flexGrow={1}>
                <FieldArray
                  name="quests"
                  render={arrayHelpers => (
                    <Box w="full">
                      <Flex
                        boxShadow="inset 0px 0px 0px 1px #AD90FF"
                        flexGrow={1}
                        p={8}
                        borderRadius={30}
                        mb={6}
                        flexDirection="column"
                      >
                        <FormLabel color="main" htmlFor="daoName">
                          Quest info
                        </FormLabel>

                        <Flex alignItems="end">
                          <Flex flexDir="column" mr={2} w="full">
                            <Field name={`quests.${questIndex}.name`}>
                              {({ field }: { field: any }) => (
                                <FormControl isRequired>
                                  <Input
                                    {...field}
                                    id={`quests.${questIndex}.name`}
                                    placeholder="Quest name"
                                  />
                                </FormControl>
                              )}
                            </Field>
                            <Box h={4} />
                            <Field name={`quests.${questIndex}.description`}>
                              {({ field }: { field: any }) => (
                                <FormControl isRequired>
                                  <Textarea
                                    {...field}
                                    id={`quests.${questIndex}.description`}
                                    placeholder="Quest description"
                                  />
                                </FormControl>
                              )}
                            </Field>
                          </Flex>

                          <Button
                            type="button"
                            isDisabled={
                              !props.values.quests[
                                props.values.quests.length - 1
                              ]?.name
                            }
                            onClick={() => {
                              arrayHelpers.push({
                                name: '',
                                description: '',
                              });
                              setQuestIndex(questIndex + 1);
                            }}
                          >
                            Add quest
                          </Button>
                        </Flex>
                      </Flex>

                      {props.values.quests.slice(0, -1).map(
                        (quest, index) =>
                          quest?.name && (
                            <Flex
                              key={index}
                              mb={4}
                              bgColor="rgba(255, 255, 255, 0.02)"
                              boxShadow="inset 0px 0px 0px 1px #AD90FF"
                              p={4}
                              borderRadius={20}
                              justify="space-between"
                            >
                              <Box>
                                <Text>{quest.name}</Text>
                                <Text>{quest.description}</Text>
                              </Box>
                              <Button
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                -
                              </Button>
                            </Flex>
                          ),
                      )}
                    </Box>
                  )}
                />
              </Flex>
            </Flex>
          </Flex>

          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
            float="right"
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default Create;
