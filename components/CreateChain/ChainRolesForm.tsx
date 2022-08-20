import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
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
  onSubmit: (values: RolesFormValues) => void | Promise<void>;
}> = ({ onSubmit }) => {
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
      spacing={10}
      boxShadow="inset 0px 0px 0px 1px white"
      borderRadius={10}
      px={{ base: 4, md: 12 }}
      py={8}
    >
      <HStack w="100%">
        <Box
          py={1}
          px={3}
          borderWidth={1}
          borderColor="gray.500"
          color="gray.500"
          borderRadius={4}
          mr={4}
        >
          STEP 3
        </Box>
        <Text fontWeight="bold" fontSize={16}>
          Members
        </Text>
      </HStack>
      <Box maxW="3xl">
        <Text>
          A quest chain can exist with only you—its creator—as a member.{' '}
        </Text>
        <Text>
          However, adding members may be beneficial when you want to divide the
          responsibilities of maintenance and reviewing of quest submissions
          between multiple people.
        </Text>
      </Box>
      <Formik initialValues={initialValues} onSubmit={submitRoles}>
        {({ isSubmitting, values }: FormikState<RolesFormValues>) => (
          <Form>
            <Flex w="full">
              <VStack
                w={{ base: '100%', md: '50%' }}
                align="flex-start"
                spacing={4}
              >
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
              </VStack>
              <Grid
                bgColor="rgba(0,0,0,0.4)"
                templateColumns="2fr 1fr 1fr 1fr"
                w="50%"
                p={8}
                alignItems="center"
                justifyItems="center"
                gap={4}
              >
                <Box />
                <Text fontSize={14} fontWeight="bold">
                  Admin
                </Text>
                <Text fontSize={14} fontWeight="bold">
                  Editor
                </Text>
                <Text fontSize={14} fontWeight="bold">
                  Reviewer
                </Text>
                <Text fontSize={14} fontWeight="bold" pr={8}>
                  Add/remove admins, editors and reviewers
                </Text>
                <CheckIcon />
                <CloseIcon color="gray.600" />
                <CloseIcon color="gray.600" />
                <Text fontSize={14} fontWeight="bold" pr={8}>
                  Add/edit/delete quests
                </Text>
                <CheckIcon />
                <CheckIcon />
                <CloseIcon color="gray.600" />
                <Text fontSize={14} fontWeight="bold" pr={8}>
                  Approve/decline submissions
                </Text>
                <CheckIcon />
                <CheckIcon />
                <CheckIcon />
              </Grid>
            </Flex>

            <SubmitButton
              isLoading={isSubmitting}
              type="submit"
              isDisabled={isDisabled}
              w="full"
            >
              Continue to Step 4
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </VStack>
  );
};
