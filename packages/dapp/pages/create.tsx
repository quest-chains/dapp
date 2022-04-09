import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';

interface MyFormValues {
  name: string;
  description: string;
  // coreMemberAddresses: string[];
}

const Create: React.FC = () => {
  const initialValues: MyFormValues = {
    name: '',
    description: '',
    // coreMemberAddresses: [],
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
          {/* Left Column: Quest Chain Name, Quest Chain Description, Core Member Addresses */}
          <Flex flexDirection="column">
            <Text mb={6} color="main" fontSize={20}>
              QUEST CHAIN INFO
            </Text>
            <Flex
              flexDir="column"
              boxShadow="inset 0px 0px 0px 1px #AD90FF"
              p={8}
              borderRadius={30}
            >
              <VStack mb={4} align="flex-start">
                <Wrap minW="20rem">
                  <Field name="name">
                    {({ field, form }: { field: any; form: any }) => (
                      <FormControl isRequired>
                        <FormLabel color="main" htmlFor="name">
                          Quest Chain Name
                        </FormLabel>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Quest Chain Name"
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Wrap>
                <Field name="description">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl isRequired>
                      <FormLabel color="main" htmlFor="description">
                        Quest Chain Description
                      </FormLabel>
                      <Input
                        {...field}
                        id="description"
                        placeholder="Quest Chain Description"
                      />
                      <FormErrorMessage>
                        {form.errors.description}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </VStack>
              {/* <FieldArray
                name="coreMemberAddresses"
                render={arrayHelpers => (
                  <Box>
                    <FormLabel color="main" htmlFor="name">
                      Core Member Addresses
                    </FormLabel>
                    {props.values.coreMemberAddresses.map((address, index) => (
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
                    ))}
                    <Button type="button" onClick={() => arrayHelpers.push('')}>
                      Add address
                    </Button>
                  </Box>
                )}
              /> */}
            </Flex>
            <Box>
              <Button
                mt={4}
                colorScheme="teal"
                isLoading={props.isSubmitting}
                type="submit"
                float="right"
              >
                Submit
              </Button>
            </Box>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default Create;
