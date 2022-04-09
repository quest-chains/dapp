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
} from '@chakra-ui/react';
import { Field, FieldArray, Form, Formik } from 'formik';

interface MyFormValues {
  daoName: string;
  coreMemberAddresses: string[];
}

const Create: React.FC = () => {
  const initialValues: MyFormValues = {
    daoName: '',
    coreMemberAddresses: [],
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
          {/* Left Column: DAO Name, Quest Chain title, Core Member Addresses */}
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
              <HStack mb={4}>
                <Field name="daoName">
                  {({ field, form }: { field: any; form: any }) => (
                    <FormControl isRequired>
                      <FormLabel color="main" htmlFor="daoName">
                        DAO Name
                      </FormLabel>
                      <Input {...field} id="daoName" placeholder="DAO Name" />
                      <FormErrorMessage>{form.errors.daoName}</FormErrorMessage>
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
              />
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
