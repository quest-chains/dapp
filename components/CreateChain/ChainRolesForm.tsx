import { CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  Field,
  FieldArray,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikState,
} from 'formik';
import { useCallback } from 'react';

import { SubmitButton } from '@/components/SubmitButton';
import { handleError } from '@/utils/helpers';
import { isSupportedNetwork, useWallet } from '@/web3';

export interface RolesFormValues {
  adminAddresses: string[];
  editorAddresses: string[];
  reviewerAddresses: string[];
}

export const ChainRolesForm: React.FC<{
  onBack?: () => void;
  onSubmit: (values: RolesFormValues) => void | Promise<void>;
}> = ({ onBack, onSubmit }) => {
  const initialValues: RolesFormValues = {
    adminAddresses: [],
    editorAddresses: [],
    reviewerAddresses: [],
  };

  const { isConnected, chainId } = useWallet();

  const isDisabled = !isConnected || !isSupportedNetwork(chainId);

  const submitRoles = useCallback(
    async (
      values: RolesFormValues,
      { setSubmitting, resetForm }: FormikHelpers<RolesFormValues>,
    ) => {
      try {
        setSubmitting(true);
        await onSubmit(values);
        resetForm();
      } catch (error) {
        handleError(error);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit],
  );

  return (
    <VStack
      w="100%"
      align="stretch"
      spacing={8}
      boxShadow="inset 0px 0px 0px 1px #AD90FF"
      borderRadius={30}
      px={{ base: 4, md: 8 }}
      py={8}
    >
      <HStack justify="space-between" w="100%">
        <Text color="main" fontSize={20}>
          QUEST CHAIN ROLES
        </Text>
      </HStack>
      <Formik initialValues={initialValues} onSubmit={submitRoles}>
        {({ isSubmitting, values }: FormikState<RolesFormValues>) => (
          <Form>
            <VStack w="100%" align="flex-start" spacing={4}>
              <FieldArray
                name="adminAddresses"
                render={arrayHelpers => (
                  <Box w="100%">
                    <FormLabel color="main" htmlFor="adminAddresses">
                      Admin Users (optional)
                    </FormLabel>
                    {values.adminAddresses.map((_address, index) => (
                      <HStack key={index} mb={2}>
                        <Box w="100%" maxW="20rem">
                          <Field name={`adminAddresses.${index}`}>
                            {({
                              field,
                            }: FieldProps<string, RolesFormValues>) => (
                              <FormControl isRequired>
                                <Input
                                  {...field}
                                  id={`adminAddresses.${index}`}
                                  placeholder="Admin Address"
                                />
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <IconButton
                          borderRadius="full"
                          onClick={() => arrayHelpers.remove(index)}
                          icon={<CloseIcon boxSize="0.7rem" />}
                          aria-label={''}
                        />
                      </HStack>
                    ))}
                    <Button
                      borderRadius="full"
                      onClick={() => arrayHelpers.push('')}
                    >
                      Add address
                    </Button>
                  </Box>
                )}
              />
              <FieldArray
                name="editorAddresses"
                render={arrayHelpers => (
                  <Box w="100%">
                    <FormLabel color="main" htmlFor="editorAddresses">
                      Editor Users (optional)
                    </FormLabel>
                    {values.editorAddresses.map((_address, index) => (
                      <HStack key={index} mb={2}>
                        <Box w="100%" maxW="20rem">
                          <Field name={`editorAddresses.${index}`}>
                            {({
                              field,
                            }: FieldProps<string, RolesFormValues>) => (
                              <FormControl isRequired>
                                <Input
                                  {...field}
                                  id={`editorAddresses.${index}`}
                                  placeholder="Editor Address"
                                />
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <IconButton
                          borderRadius="full"
                          onClick={() => arrayHelpers.remove(index)}
                          icon={<CloseIcon boxSize="0.7rem" />}
                          aria-label={''}
                        />
                      </HStack>
                    ))}
                    <Button
                      borderRadius="full"
                      onClick={() => arrayHelpers.push('')}
                    >
                      Add address
                    </Button>
                  </Box>
                )}
              />
              <FieldArray
                name="reviewerAddresses"
                render={arrayHelpers => (
                  <Box w="100%">
                    <FormLabel htmlFor="reviewerAddresses" color="main">
                      Reviewer Users (optional)
                    </FormLabel>
                    {values.reviewerAddresses.map((_address, index) => (
                      <HStack key={index} mb={2}>
                        <Box w="100%" maxW="20rem">
                          <Field name={`reviewerAddresses.${index}`}>
                            {({
                              field,
                            }: FieldProps<string, RolesFormValues>) => (
                              <FormControl isRequired>
                                <Input
                                  {...field}
                                  id={`reviewerAddresses.${index}`}
                                  placeholder="Reviewer Address"
                                />
                              </FormControl>
                            )}
                          </Field>
                        </Box>
                        <IconButton
                          borderRadius="full"
                          onClick={() => arrayHelpers.remove(index)}
                          icon={<CloseIcon boxSize="0.7rem" />}
                          aria-label={''}
                        />
                      </HStack>
                    ))}
                    <Button
                      borderRadius="full"
                      onClick={() => arrayHelpers.push('')}
                    >
                      Add address
                    </Button>
                  </Box>
                )}
              />
              <Flex
                mt={4}
                w="100%"
                justify={onBack ? 'space-between' : 'flex-end'}
                align="center"
              >
                {onBack && (
                  <Button
                    variant="ghost"
                    mr={3}
                    onClick={onBack}
                    borderRadius="full"
                    boxShadow="inset 0px 0px 0px 1px #AD90FF"
                  >
                    Back
                  </Button>
                )}
                <SubmitButton
                  isLoading={isSubmitting}
                  type="submit"
                  isDisabled={isDisabled}
                >
                  Create
                </SubmitButton>
              </Flex>
            </VStack>
          </Form>
        )}
      </Formik>
    </VStack>
  );
};
