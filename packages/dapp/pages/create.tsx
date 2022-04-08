import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik } from 'formik';

const Home: React.FC = () => {
  // function validateDAOName(value: string) {
  //   let error;
  //   if (!value) {
  //     error = 'DAO Name is required';
  //   }
  //   return error;
  // }

  return (
    <VStack>
      <Formik
        initialValues={{
          daoName: '',
          coreMemberAddresses: [],
          quests: [],
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {props => (
          <Form>
            {/* <Field name="daoName" validate={validateDAOName}>
              {({ field, form }: { field: any; form: any }) => (
                <FormControl
                  isInvalid={form.errors.daoName && form.touched.daoName}
                >
                  <FormLabel htmlFor="daoName">DAO Name</FormLabel>
                  <Input {...field} id="daoName" placeholder="DAO Name" />
                  <FormErrorMessage>{form.errors.daoName}</FormErrorMessage>
                </FormControl>
              )}
            </Field> */}
            <Flex minW="27rem">
              {/* Left Column: DAO Name, Quest Chain title, Core Member Addresses */}
              <Flex flexDir="column">
                <HStack mb={4}>
                  <Field name="daoName">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel htmlFor="daoName">DAO Name</FormLabel>
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
                        <FormLabel htmlFor="questChainName">
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
                      <FormLabel htmlFor="daoName">
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

              <Flex borderLeft="1px solid rgba(255, 255, 255, 0.15)" mx={6} />

              {/* Right Column, Quest Creator */}
              <VStack minW="27rem">
                <FieldArray
                  name="quests"
                  render={arrayHelpers => (
                    <Box w="full">
                      <FormLabel htmlFor="daoName">Quests</FormLabel>
                      {props.values.quests.map((quest, index) => (
                        <Flex
                          key={index}
                          mb={4}
                          bgColor="rgba(255, 255, 255, 0.02)"
                          p={4}
                          borderRadius={8}
                        >
                          <Flex flexDir="column" mr={2} w="full">
                            <Field name={`quests.${index}.name`}>
                              {({ field }: { field: any }) => (
                                <FormControl isRequired>
                                  <Input
                                    {...field}
                                    id={`quests.${index}.name`}
                                    placeholder="Quest name"
                                  />
                                </FormControl>
                              )}
                            </Field>
                            <Box h={4} />
                            <Field name={`quests.${index}.description`}>
                              {({ field }: { field: any }) => (
                                <FormControl isRequired>
                                  <Textarea
                                    {...field}
                                    id={`quests.${index}.description`}
                                    placeholder="Quest description"
                                  />
                                </FormControl>
                              )}
                            </Field>
                          </Flex>
                          <Button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </Button>
                        </Flex>
                      ))}
                      <Button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({
                            name: '',
                            description: '',
                          })
                        }
                      >
                        {/* show this when user has removed all quests from the list */}
                        Add quest
                      </Button>
                    </Box>
                  )}
                />
              </VStack>
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
    </VStack>
  );
};

export default Home;
